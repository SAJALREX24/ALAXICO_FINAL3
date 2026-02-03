import React from 'react';
import Lottie from 'lottie-react';

// Free medical Lottie animations from LottieFiles
const LOTTIE_ANIMATIONS = {
  'Diagnostic Equipment': 'https://lottie.host/d5f80fe9-e6b2-4c3e-92f8-1e6e79b8e13e/MqYfgdD9iL.json',
  'Hospital Furniture': 'https://lottie.host/1d9a7c2e-6a0e-4f8d-b5c4-8e9f1a2b3c4d/hospital-bed.json',
  'Surgical Instruments': 'https://lottie.host/e8f1a2b3-c4d5-6e7f-8a9b-0c1d2e3f4a5b/surgery.json',
  'Patient Monitoring': 'https://lottie.host/3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b/heartbeat.json',
  'Lab Equipment': 'https://lottie.host/7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d/microscope.json',
};

// Fallback inline animation data for categories
const FALLBACK_ANIMATIONS = {
  'Diagnostic Equipment': {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    layers: [{
      ty: 4,
      nm: "pulse",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 1, k: [{ t: 0, s: [20, 50], e: [80, 50] }, { t: 30, s: [80, 50], e: [80, 30] }, { t: 35, s: [80, 30], e: [80, 70] }, { t: 40, s: [80, 70], e: [80, 50] }, { t: 60, s: [80, 50] }] },
        s: { a: 0, k: [100, 100] }
      },
      shapes: [{
        ty: "el",
        p: { a: 0, k: [0, 0] },
        s: { a: 1, k: [{ t: 0, s: [10, 10] }, { t: 30, s: [20, 20] }, { t: 60, s: [10, 10] }] }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.22, 0.52, 0.93, 1] }
      }]
    }]
  },
  'Hospital Furniture': {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    layers: [{
      ty: 4,
      nm: "bed",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 55] },
        s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 30, s: [105, 105] }, { t: 60, s: [100, 100] }] }
      },
      shapes: [{
        ty: "rc",
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [60, 25] },
        r: { a: 0, k: 5 }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.22, 0.72, 0.55, 1] }
      }]
    }]
  },
  'Surgical Instruments': {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    layers: [{
      ty: 4,
      nm: "scissors",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 50] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 15, s: [10] }, { t: 30, s: [0] }, { t: 45, s: [-10] }, { t: 60, s: [0] }] },
        s: { a: 0, k: [100, 100] }
      },
      shapes: [{
        ty: "rc",
        p: { a: 0, k: [0, -15] },
        s: { a: 0, k: [8, 40] },
        r: { a: 0, k: 2 }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.4, 0.45, 0.95, 1] }
      }]
    }]
  },
  'Patient Monitoring': {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    layers: [{
      ty: 4,
      nm: "heart",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 50] },
        s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 10, s: [115, 115] }, { t: 20, s: [100, 100] }, { t: 30, s: [115, 115] }, { t: 40, s: [100, 100] }] }
      },
      shapes: [{
        ty: "el",
        p: { a: 0, k: [0, 0] },
        s: { a: 0, k: [30, 30] }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.92, 0.26, 0.38, 1] }
      }]
    }]
  },
  'Lab Equipment': {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    layers: [{
      ty: 4,
      nm: "flask",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [50, 50] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 20, s: [5] }, { t: 40, s: [-5] }, { t: 60, s: [0] }] },
        s: { a: 0, k: [100, 100] }
      },
      shapes: [{
        ty: "rc",
        p: { a: 0, k: [0, 5] },
        s: { a: 0, k: [30, 45] },
        r: { a: 0, k: 3 }
      }, {
        ty: "fl",
        c: { a: 0, k: [0.29, 0.78, 0.76, 1] }
      }]
    }]
  }
};

const LottieIcon = ({ category, className = "w-16 h-16" }) => {
  const animationData = FALLBACK_ANIMATIONS[category];
  
  if (!animationData) {
    return null;
  }

  return (
    <div className={className}>
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieIcon;
