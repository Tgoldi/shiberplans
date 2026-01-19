export const generateInvoiceHTML = ({ clientName, offerName, price, signature, date }) => {
    return `
    <div dir="rtl" style="font-family: 'Heebo', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #333333; padding: 40px; border: 1px solid #eeeeee; border-radius: 8px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000000; padding-bottom: 20px;">
            <h1 style="margin: 0; font-size: 28px; color: #000000;">אישור הזמנה / הצעת מחיר</h1>
            <p style="margin: 5px 0 0; color: #666666;">Amit Shiber - Video Production</p>
        </div>

        <!-- Client Details -->
        <div style="margin-bottom: 30px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; width: 100px;">לכבוד:</td>
                    <td style="padding: 10px 0;">${clientName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold;">תאריך:</td>
                    <td style="padding: 10px 0;">${date}</td>
                </tr>
            </table>
        </div>

        <!-- Order Details Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
                <tr style="background-color: #f8f8f8;">
                    <th style="text-align: right; padding: 15px; border-bottom: 2px solid #eeeeee;">תיאור השירות</th>
                    <th style="text-align: left; padding: 15px; border-bottom: 2px solid #eeeeee;">מחיר</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #eeeeee;">
                        <strong>${offerName}</strong><br>
                        <span style="font-size: 14px; color: #666666;">כולל סבב תיקונים אחד ללא עלות.</span>
                    </td>
                    <td style="text-align: left; padding: 15px; border-bottom: 1px solid #eeeeee; font-weight: bold;">${price}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td style="padding: 15px; border-top: 2px solid #000000; font-weight: bold;">סה"כ לתשלום</td>
                    <td style="text-align: left; padding: 15px; border-top: 2px solid #000000; font-weight: bold; font-size: 18px;">${price}</td>
                </tr>
            </tfoot>
        </table>

        <!-- Terms & Signature -->
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin-top: 20px;">
            <h3 style="margin: 0 0 15px; font-size: 16px;">אישור וחתימה:</h3>
            <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.5; color: #555555;">
                בחתימתי מטה אני מאשר את פרטי ההזמנה ואת תנאי ההתקשרות כפי שהוצגו במעמד החתימה.
            </p>
            
            <div style="margin-top: 20px; text-align: center;">
                <p style="margin-bottom: 10px; font-weight: bold; font-size: 14px;">חתימת הלקוח:</p>
                <img src="${signature}" alt="Signature" style="max-width: 200px; height: auto; border-bottom: 1px solid #cccccc; padding-bottom: 10px;" />
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999999;">
            מסמך זה הופק דיגיטלית באמצעות ShiberPlans
        </div>
    </div>
    `;
};
