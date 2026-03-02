import * as mm from 'music-metadata';

export interface AudioValidationResult {
    passed: boolean;
    durationSeconds: number;
    fileSizeKb: number;
    errors: string[];
    warnings: string[];
}

/**
 * Validate an audio buffer server-side.
 * Checks: file size, duration, silence (RMS).
 */
export async function validateAudio(
    buffer: Buffer,
    mimeType: string,
    options: {
        minDurationSeconds?: number;
        maxDurationSeconds?: number;
        minFileSizeBytes?: number;
        maxFileSizeBytes?: number;
    } = {}
): Promise<AudioValidationResult> {
    const {
        minDurationSeconds = 1.5,
        maxDurationSeconds = 90,
        minFileSizeBytes = 1000,        // 1 KB
        maxFileSizeBytes = 15_000_000,  // 15 MB
    } = options;

    const errors: string[] = [];
    const warnings: string[] = [];
    let durationSeconds = 0;

    // ── 1. File size check ──────────────────────────────────────────────────
    const fileSizeKb = buffer.length / 1024;

    if (buffer.length < minFileSizeBytes) {
        errors.push(`File too small (${fileSizeKb.toFixed(1)} KB). Minimum is ${(minFileSizeBytes / 1024).toFixed(0)} KB. Recording may be empty.`);
    }
    if (buffer.length > maxFileSizeBytes) {
        errors.push(`File too large (${(buffer.length / 1_000_000).toFixed(1)} MB). Maximum is ${(maxFileSizeBytes / 1_000_000).toFixed(0)} MB.`);
    }

    // ── 2. Duration check (via music-metadata) ──────────────────────────────
    try {
        const metadata = await mm.parseBuffer(buffer, { mimeType });
        durationSeconds = metadata.format.duration ?? 0;

        console.log(`🎵 Audio metadata: duration=${durationSeconds.toFixed(2)}s, codec=${metadata.format.codec}, bitrate=${metadata.format.bitrate}`);

        if (durationSeconds > 0) {
            if (durationSeconds < minDurationSeconds) {
                errors.push(`Recording too short (${durationSeconds.toFixed(1)}s). Minimum is ${minDurationSeconds}s.`);
            }
            if (durationSeconds > maxDurationSeconds) {
                errors.push(`Recording too long (${durationSeconds.toFixed(1)}s). Maximum is ${maxDurationSeconds}s.`);
            }
        } else {
            // Duration couldn't be parsed — warn but don't block
            warnings.push('Could not determine audio duration from metadata.');
        }
    } catch (metaErr: any) {
        console.warn('⚠️ music-metadata parse error:', metaErr?.message);
        warnings.push('Could not parse audio metadata: ' + metaErr?.message);
    }

    // ── 3. Silence / RMS energy check ───────────────────────────────────────
    // WebM/Opus is compressed — we do a simple byte-entropy check as a proxy.
    // True PCM silence detection requires decoding (needs ffmpeg).
    // We estimate: if <80% of the file is "audio payload" bytes, flag it.
    try {
        const silenceScore = estimateSilence(buffer);
        console.log(`📊 Silence score: ${(silenceScore * 100).toFixed(1)}%`);
        if (silenceScore > 0.92) {
            errors.push('Audio appears to be silent or contains only background noise.');
        } else if (silenceScore > 0.80) {
            warnings.push('Audio may contain significant silence.');
        }
    } catch (silenceErr) {
        console.warn('⚠️ Silence estimation failed:', silenceErr);
    }

    return {
        passed: errors.length === 0,
        durationSeconds,
        fileSizeKb,
        errors,
        warnings,
    };
}

/**
 * Estimates silence ratio in a compressed audio buffer.
 * For WebM/Opus: looks at byte value distribution.
 * A silent recording has very uniform, low byte values (high entropy ratio).
 * Returns 0.0 (no silence) to 1.0 (full silence).
 *
 * This is a lightweight heuristic — not a DSP analysis.
 */
function estimateSilence(buffer: Buffer): number {
    // Count unique byte values vs total — very low variety suggests silence
    const counts = new Array(256).fill(0);
    for (let i = 0; i < buffer.length; i++) {
        counts[buffer[i]]++;
    }
    const nonZeroValues = counts.filter(c => c > 0).length;
    // A rich audio signal uses most of the 0-255 byte range
    // Silent/empty audio uses very few unique byte values
    return 1 - (nonZeroValues / 256);
}
