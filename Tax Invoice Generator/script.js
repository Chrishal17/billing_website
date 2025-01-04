let products = [];

        function addProduct() {
            const description = document.getElementById('productDescription').value;
            const hsn = document.getElementById('productHSN').value;
            const quantity = parseFloat(document.getElementById('productQuantity').value);
            const rate = parseFloat(document.getElementById('productRate').value);
            const gstRate = parseFloat(document.getElementById('productGSTRate').value);
            const additionalDetails = document.getElementById('productAdditionalDetails').value;
            const amount = quantity * rate;

            const product = { description, hsn, quantity, rate, gstRate, amount, additionalDetails };
            products.push(product);

            updateProductTable();
            clearProductInputs();
        }

        function updateProductTable() {
            const tableBody = document.querySelector('#productTable tbody');
            tableBody.innerHTML = '';
            products.forEach((product, index) => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${product.description}</td>
                    <td>${product.hsn}</td>
                    <td>${product.quantity}</td>
                    <td>${product.rate.toFixed(2)}</td>
                    <td>${product.gstRate}%</td>
                    <td>${product.amount.toFixed(2)}</td>
                    <td>${product.additionalDetails}</td>
                    <td>
                        <button onclick="editProduct(${index})">Edit</button>
                        <button onclick="deleteProduct(${index})">Delete</button>
                    </td>
                `;
            });
        }

        function clearProductInputs() {
            document.getElementById('productDescription').value = '';
            document.getElementById('productHSN').value = '';
            document.getElementById('productQuantity').value = '';
            document.getElementById('productRate').value = '';
            document.getElementById('productGSTRate').value = '';
            document.getElementById('productAdditionalDetails').value = '';
        }

        function editProduct(index) {
            const product = products[index];
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productHSN').value = product.hsn;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productRate').value = product.rate;
            document.getElementById('productGSTRate').value = product.gstRate;
            document.getElementById('productAdditionalDetails').value = product.additionalDetails;

            products.splice(index, 1);
            updateProductTable();
        }

        function deleteProduct(index) {
            products.splice(index, 1);
            updateProductTable();
        }

        function generateInvoice() {
            const invoiceNumber = document.getElementById('invoiceNumber').value || generateInvoiceNumber();
            const invoiceDate = document.getElementById('invoiceDate').value || new Date().toLocaleDateString();

            const { subtotal, totalGST, total } = calculateTotals();

            const qr = qrcode(0, 'M');
            qr.addData(`upi://pay?pa=9962614327@okbizaxis&pn=HalPowerConversion&am=${total.toFixed(2)}`);
            qr.make();

            const invoiceHTML = `
                <div class="invoice-title">TAX INVOICE</div>
                <div class="invoice-header">
                    <div class="company-details">
                        <strong>${document.getElementById('companyName').value}</strong><br>
                        ${document.getElementById('companyAddress').value}<br>
                        Mobile No: ${document.getElementById('companyMobile').value}<br>
                        GSTIN/UIN: ${document.getElementById('companyGSTIN').value}<br>
                        State Name: ${document.getElementById('companyState').value}, Code: ${document.getElementById('companyStateCode').value}<br>
                        Email id: ${document.getElementById('companyEmail').value}
                    </div>
                    <div class="invoice-info">
                        <strong>Invoice No: ${invoiceNumber}</strong><br>
                        Dated: ${invoiceDate}
                    </div>
                </div>

                <div class="customer-details">
                    <strong>Bill To,</strong><br>
                    ${document.getElementById('customerName').value}<br>
                    ${document.getElementById('customerAddress').value}<br>
                    GSTIN/UIN: ${document.getElementById('customerGSTIN').value}<br>
                    State Name: ${document.getElementById('customerState').value}, Code: ${document.getElementById('customerStateCode').value}
                </div>

                <table class="invoice-table">
                    <tr>
                        <td>Delivery Note: ${document.getElementById('deliveryNote').value}</td>
                        <td>Mode/Terms of Payment: ${document.getElementById('paymentTerms').value}</td>
                        <td>Reference No. & Date: ${document.getElementById('referenceNo').value}</td>
                        <td>Other References: ${document.getElementById('otherReference').value}</td>
                    </tr>
                    <tr>
                        <td>Buyer Order Number: ${document.getElementById('buyerOrder').value}</td>
                        <td>Dated: ${document.getElementById('buyerOrderDate').value}</td>
                        <td>Dispatch Doc No: ${document.getElementById('dispatchDoc').value}</td>
                        <td>Delivery Note Date: ${document.getElementById('deliveryNoteDate').value}</td>
                    </tr>
                    <tr>
                        <td>Dispatched through: ${document.getElementById('dispatchedThrough').value}</td>
                        <td>Destination: ${document.getElementById('destination').value}</td>
                        <td colspan="2">Terms of Delivery: ${document.getElementById('termsOfDelivery').value}</td>
                    </tr>
                </table>

                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>Sl.No</th>
                            <th>Description of Goods</th>
                            <th>HSN/SAC</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Per</th>
                            <th>GST Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map((product, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${product.description}</td>
                                <td>${product.hsn}</td>
                                <td>${product.quantity}</td>
                                <td>${product.rate.toFixed(2)}</td>
                                <td>No's</td>
                                <td>${product.gstRate}%</td>
                                <td>${product.amount.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colspan="8">Additional Details: ${product.additionalDetails}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6"></td>
                            <td>SGST</td>
                            <td>${(totalGST / 2).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6"></td>
                            <td>CGST</td>
                            <td>${(totalGST / 2).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6"></td>
                            <td><strong>Total</strong></td>
                            <td><strong>₹${total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>

                <div>
                    <p><strong>Amount Charged (in words):</strong> ${numberToWords(total)} Only</p>
                    <p><strong>Tax Amount (in words):</strong> ${numberToWords(totalGST)} Only</p>
                </div>

                <div>
                    <strong>Company's Bank Details:</strong><br>
                    Bank Name: BANK OF INDIA<br>
                    A/C No.: 801420110001146<br>
                    Branch & IFS Code: KODAAMBAKKAM & BKID0008014
                </div>

                <div>
                    <strong>Declaration:</strong><br>
                    We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                </div>

                <div class="signature-section">
                    <div class="qr-code">
                        ${qr.createImgTag(4)}
                        <p>Scan Here To Pay</p>
                    </div>
                    <div>
                        <p>Customer's Signature</p>
                        <div class="signature-line"></div>
                    </div>
                    <div>
                        <p>For HAL POWER CONVERSION<br>Authorised Signatory</p>
                        <div class="signature-line"></div>
                    </div>
                </div>
            `;

            document.getElementById('invoicePreview').innerHTML = invoiceHTML;
        }

        function calculateTotals() {
            const subtotal = products.reduce((sum, product) => sum + product.amount, 0);
            const totalGST = products.reduce((sum, product) => sum + (product.amount * product.gstRate / 100), 0);
            const total = subtotal + totalGST;
            return { subtotal, totalGST, total };
        }

        function generateInvoiceNumber() {
            const date = new Date();
            const year = date.getFullYear().toString().substr(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            return `HAL/${year}${month}${day}/${random}`;
        }

        function numberToWords(number) {
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

            function convertLessThanOneThousand(n) {
                if (n < 10) return ones[n];
                if (n < 20) return teens[n - 10];
                if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
                return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convertLessThanOneThousand(n % 100) : '');
            }

            if (number === 0) return 'Zero';

            const inr = Math.floor(number);
            const paise = Math.round((number - inr) * 100);

            let result = '';

            if (inr > 0) {
                const crores = Math.floor(inr / 10000000);
                const lakhs = Math.floor((inr % 10000000) / 100000);
                const thousands = Math.floor((inr % 100000) / 1000);
                const hundreds = inr % 1000;

                if (crores > 0) result += convertLessThanOneThousand(crores) + ' Crore ';
                if (lakhs > 0) result += convertLessThanOneThousand(lakhs) + ' Lakh ';
                if (thousands > 0) result += convertLessThanOneThousand(thousands) + ' Thousand ';
                if (hundreds > 0) result += convertLessThanOneThousand(hundreds);

                result += ' Rupees';
            }

            if (paise > 0) {
                result += (inr > 0 ? ' and ' : '') + convertLessThanOneThousand(paise) + ' Paise';
            }

            return result;
        }

        function printInvoice() {
            window.print();
        }

        async function generatePDF() {
            const invoice = document.getElementById('invoicePreview');
            if (!invoice.innerHTML) {
                alert('Please generate an invoice first');
                return;
            }

            // Create a clone of the invoice for PDF generation
            const clone = invoice.cloneNode(true);
            clone.style.padding = '100px';
            document.body.appendChild(clone);

            try {
                const canvas = await html2canvas(clone, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                pdf.save(`${document.getElementById('invoiceNumber').value} ${document.getElementById('customerName').value || ''}.pdf`);
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
            } finally {
                document.body.removeChild(clone);
            }
        }