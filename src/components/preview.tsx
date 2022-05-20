// Preview component for iframe display
import "./preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  err: string;
}
const html = `
<html>
  <head>
  <style>html {background-color: white;}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError = (error) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>'+ error + '</div>';
        console.error(error);
      }
      
      window.addEventListener('error', (e) => {
        e.preventDefault();
        handleError(e.error);
      });

      window.addEventListener('message', (e) => {
        const handleError = (error) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>'+ error + '</div>';
          console.log(error)
        };
        try {
          eval(e.data);
        } catch (error) {
          
          handleError(error);
        }
      },false);
    </script>   
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // To refresh iframe incase user deleted the root div for outputs
    iframe.current.srcdoc = html;
    // Post code bundled to iframe, delay 50mil for iframe to refresh
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  // console.log(err);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='preview'
        ref={iframe}
        srcDoc={html}
        sandbox='allow-scripts'
      />
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;
