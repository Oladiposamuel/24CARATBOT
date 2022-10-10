const renewSubscription = (lastName)=> {
    const htmlDoc = (
        `<!DOCTYPE html>
            <html>
            <head>
            <title>Renew Account subscription</title>
            <style>

                table {
                    margin: 0 auto;
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
                    <h3 class= "headerText">RENEW ACCOUNT SUBSCRIPTION </h3> 
                </tr>
                
                <tr>
                    <p class="text">Hello ${lastName},</p>

                    <p class="text">
                        This is to kindly remind you that your subscription will be due in 7 days.
                    </p>

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

module.exports = renewSubscription;