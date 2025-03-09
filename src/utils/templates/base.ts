import { TEMPLATE } from "../types";

export const MODEL_HTML_TEMPLATE = (
  information: TEMPLATE
): string => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${information.title}</title>
      <style>
          * {
              box-sizing: border-box;
              padding: 0;
              margin: 0;
              font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
          }
          body {
              height: 100vh;
              display: flex;
              justify-content: center;
          }
            .sub-container {
              height: 40%;
              padding: 12px;
              margin-top: 90px;
              border-radius: 10px;
              border: 1px solid #858282;
            }
            
            .header {
              padding-bottom: 8px;
              border-bottom: 1px solid #6c87be;
              text-align: center;
            }
            
            h1 {
              text-align: center;
              font-size: 20px;
              padding: 8px 0;
            }
           
            h2 {
              padding: 12px;
              text-align: center;
            }
            .content {
              padding: 0 30px;
              height: 70%;
              line-height: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              font-size: 0.9rem;
              text-align: center;
            }
         
            footer {
              font-size: 12px;
              padding: 4px 0;
              text-align: center;
              color: rgb(78,76,76);
            }
      </style>
  </head>
  <body>
      <div class="container">
        <div class="sub-container">
          <div class="header">
            ${logo}
            <p>${information.explanation}</p>
          </div>
          <div class="content">
            ${information.text}
          </div>
         </div>
         <footer>
          You received this email to let you know about important changes to your LAO SARL Account and services.
          © 2023 DT LLC, 1600, CAMEROUN, DOUALA.
         </footer>
        </div>
  </body>
  </html>`;
};

const logo = "<div style='color: #1C1F4F;font-size: 16px;font-family: Arial, sans-serif'>LAO SARL</div>";