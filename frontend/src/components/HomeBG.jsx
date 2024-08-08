import { useEffect } from "react";

export default function HomeBG() {
    
    useEffect(() => {
        if (window.particlesJS) {
          window.particlesJS.load('particles-js', '/particles.json', function() {
            console.log('particles.json loaded...');
          });
        }
      }, []);

  return (
    <div className="absolute w-full h-screen bg-transparent -z-10">
        <div id="particles-js" className="absolute w-full h-full"></div>
    </div>
  )
}
