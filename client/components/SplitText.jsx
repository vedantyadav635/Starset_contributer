import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SplitText = ({
  text = '',
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete = () => {}
}) => {
  const ref = useRef(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [lines, setLines] = useState([]);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  const words = text.split(' ');

  // Calculate lines based on offsetTop of words
  useLayoutEffect(() => {
    if (!ref.current || !fontsLoaded || !text) return;

    // Reset lines first to measure raw words
    setLines([]);

    // We need to wait for a paint/resize to measure offsets accurately
    const measure = () => {
      const wordElements = ref.current.querySelectorAll('.split-word-measure');
      if (!wordElements.length) return;

      const linesMap = {};
      wordElements.forEach((el, index) => {
        const top = el.offsetTop;
        if (!linesMap[top]) {
          linesMap[top] = [];
        }
        linesMap[top].push(words[index]);
      });

      const sortedLines = Object.keys(linesMap)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .map(top => linesMap[top]);

      setLines(sortedLines);
    };

    // Measure initially
    measure();

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [text, fontsLoaded]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      // If we need lines but they aren't calculated yet, wait
      if (splitType.includes('lines') && lines.length === 0) return;
      if (animationCompletedRef.current) return;
      
      const el = ref.current;

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      
      let start = `top ${startPct}%`;
      if (marginValue !== 0) {
        start = () => {
          const triggerPixel = (startPct / 100) * window.innerHeight + marginValue;
          return `top ${triggerPixel}px`;
        };
      }

      let targets = [];
      if (splitType.includes('chars')) {
        targets = el.querySelectorAll('.split-char');
      } else if (splitType.includes('words')) {
        targets = el.querySelectorAll('.split-word');
      } else if (splitType.includes('lines')) {
        targets = el.querySelectorAll('.split-line');
      }

      if (!targets.length) return;

      const tween = gsap.fromTo(
        targets,
        { ...from },
        {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          onComplete: () => {
            animationCompletedRef.current = true;
            onCompleteRef.current?.();
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        tween.kill();
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        lines
      ],
      scope: ref
    }
  );

  const renderWord = (word, wordIdx, isMeasure = false) => {
    const showChars = splitType.includes('chars');
    return (
      <span
        key={wordIdx}
        className={isMeasure ? 'split-word-measure' : 'split-word'}
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          marginRight: '0.25em'
        }}
      >
        {showChars ? (
          word.split('').map((char, charIdx) => (
            <span
              key={charIdx}
              className="split-char"
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))
        ) : (
          word
        )}
      </span>
    );
  };

  const renderContent = () => {
    // If lines need to be rendered and are computed:
    if (splitType.includes('lines') && lines.length > 0) {
      return lines.map((lineWords, lineIdx) => (
        <span
          key={lineIdx}
          className="split-line"
          style={{
            display: 'block',
            overflow: 'hidden'
          }}
        >
          {lineWords.map((word, wordIdx) => renderWord(word, wordIdx))}
        </span>
      ));
    }

    // If lines are requested but not yet computed, render invisible measure words
    if (splitType.includes('lines') && lines.length === 0) {
      return words.map((word, wordIdx) => renderWord(word, wordIdx, true));
    }

    // Default: just render words/chars directly
    return words.map((word, wordIdx) => renderWord(word, wordIdx));
  };

  const style = {
    textAlign,
    overflow: 'hidden',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    willChange: 'transform, opacity'
  };

  const classes = `split-parent ${className}`;
  const Tag = tag || 'p';

  return (
    <Tag ref={ref} style={style} className={classes}>
      {renderContent()}
    </Tag>
  );
};

export default SplitText;
