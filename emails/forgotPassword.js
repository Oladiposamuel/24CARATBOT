const forgotPassword = (password)=> {
    const htmlDoc = (
        `<!DOCTYPE html>
            <html>
            <head>
            <title>Forgot Password</title>
            <style>

                table {

                }

                tr {
                    width: 100%;
                }

                .tableContent {
                    border: 1px solid black;
                    margin: 0 auto;
                }

                .headerText {
                    text-align: center;
                    text-transform: capitalize;
                    color: red;
                    font-size: 24px;
                    font-weight: 700;
                }

                .text {
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                }

                .cheerText {
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                    margin-bottom: 0px;
                }

                .teamText {
                    text-align: center;
                    font-size: 16px;
                    font-weight: 400;
                    margin-top: 0px;
                }

            </style>
            </head>
            <body>
            
            <table>
                <tr class="tableContent">
                    <h3 class= "headerText">ACCOUNT VERIFICATION </h3> 
                </tr>
                
                <tr>
                    <p class="text">Hello Samuel,</p>

                    <p class="text">
                        We received a request to reset your password. Your new password is ${password}.
                        You can change the your password later in your account settings.
                    </p>

                    <p class="text"> If you did not make this change, kindly contact. </p>
                    
                    <p class="text">help@store.com</p>
                </tr>

                <tr></tr>

                <tr>
                    <p class="cheerText"> Cheers, </p>
                    <p class="teamText"> The Store Team. </p>
                </tr>

                <tr></tr>

                <tr>
                    <p class="text"> &copy; 2021 SOLAB Technologies, All rights reserved. </p>
                    <p class="text"> 127 Itire St, Surulere, 100001, Lagos. </p>
                </tr>

            </table>
            
            </body>
        </html>`);

    return htmlDoc;

}

module.exports = forgotPassword;