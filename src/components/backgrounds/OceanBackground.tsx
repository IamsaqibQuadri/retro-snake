import React from 'react';

const OceanBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,70%,85%)] via-[hsl(200,80%,70%)] to-[hsl(200,90%,50%)]" />
      
      {/* Animated waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div className="absolute bottom-0 w-[200%] h-24 bg-gradient-to-t from-[hsl(200,90%,40%)] to-transparent opacity-60 animate-[wave_8s_ease-in-out_infinite]" 
             style={{ 
               borderRadius: '100% 100% 0 0',
               animation: 'wave 8s ease-in-out infinite'
             }} />
        <div className="absolute bottom-0 w-[200%] h-20 bg-gradient-to-t from-[hsl(200,80%,50%)] to-transparent opacity-40 animate-[wave_6s_ease-in-out_infinite_0.5s]"
             style={{ 
               borderRadius: '100% 100% 0 0',
               animation: 'wave 6s ease-in-out infinite 0.5s'
             }} />
      </div>

      {/* Floating bubbles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`bubble-${i}`}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10%',
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            animation: `float-up ${Math.random() * 10 + 8}s ease-in ${Math.random() * 5}s infinite`,
          }}
        />
      ))}

      {/* Swimming fish */}
      {[...Array(5)].map((_, i) => (
        <div
          key={`fish-${i}`}
          className="absolute text-2xl"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `-5%`,
            animation: `swim ${15 + Math.random() * 10}s linear ${Math.random() * 10}s infinite`,
            transform: i % 2 === 0 ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        >
          🐠
        </div>
      ))}

      {/* Additional fish swimming opposite direction */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`fish-reverse-${i}`}
          className="absolute text-2xl"
          style={{
            top: `${30 + Math.random() * 50}%`,
            right: `-5%`,
            animation: `swim-reverse ${12 + Math.random() * 8}s linear ${Math.random() * 8}s infinite`,
            transform: 'scaleX(-1)',
          }}
        >
          🐟
        </div>
      ))}

      {/* Water ripple effect overlays */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={`ripple-${i}`}
            className="absolute rounded-full border-2 border-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '0px',
              height: '0px',
              animation: `ripple ${6 + Math.random() * 4}s ease-out ${Math.random() * 8}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(-10px); }
        }

        @keyframes float-up {
          0% { 
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes swim {
          0% { transform: translateX(0) translateY(0) scaleX(1); }
          25% { transform: translateX(25vw) translateY(-20px) scaleX(1); }
          50% { transform: translateX(50vw) translateY(0) scaleX(1); }
          75% { transform: translateX(75vw) translateY(-15px) scaleX(1); }
          100% { transform: translateX(110vw) translateY(0) scaleX(1); }
        }

        @keyframes swim-reverse {
          0% { transform: translateX(0) translateY(0) scaleX(-1); }
          25% { transform: translateX(-25vw) translateY(-15px) scaleX(-1); }
          50% { transform: translateX(-50vw) translateY(0) scaleX(-1); }
          75% { transform: translateX(-75vw) translateY(-20px) scaleX(-1); }
          100% { transform: translateX(-110vw) translateY(0) scaleX(-1); }
        }

        @keyframes ripple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default OceanBackground;
