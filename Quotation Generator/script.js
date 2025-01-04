let items = [];

        function addItem() {
            const item = {
                description: '',
                quantity: 0,
                rate: 0,
                cgst: 0,
                sgst: 0,
                amount: 0,
                make: '',
                warranty: '',
                hsn: ''
            };
            items.push(item);
            updateItemsTable();
        }

        function updateItemsTable() {
            const tbody = document.getElementById('itemsBody');
            tbody.innerHTML = '';
            items.forEach((item, index) => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>
                        <textarea onchange="updateItem(${index}, 'description', this.value)" placeholder="Description">${item.description}</textarea>
                        <br>Make: <input type="text" onchange="updateItem(${index}, 'make', this.value)" value="${item.make}" placeholder="Make">
                        <br>Warranty: <input type="text" onchange="updateItem(${index}, 'warranty', this.value)" value="${item.warranty}" placeholder="Warranty">
                        <br>HSN: <input type="text" onchange="updateItem(${index}, 'hsn', this.value)" value="${item.hsn}" placeholder="HSN">
                    </td>
                    <td><input type="number" onchange="updateItem(${index}, 'quantity', this.value)" value="${item.quantity}"></td>
                    <td><input type="number" onchange="updateItem(${index}, 'rate', this.value)" value="${item.rate}"></td>
                    <td><input type="number" onchange="updateItem(${index}, 'cgst', this.value)" value="${item.cgst}"></td>
                    <td><input type="number" onchange="updateItem(${index}, 'sgst', this.value)" value="${item.sgst}"></td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td><button onclick="removeItem(${index})">Remove</button></td>
                `;
            });
        }

        function updateItem(index, field, value) {
            items[index][field] = field === 'quantity' || field === 'rate' || field === 'cgst' || field === 'sgst' ? parseFloat(value) : value;
            if (field === 'quantity' || field === 'rate' || field === 'cgst' || field === 'sgst') {
                calculateAmount(index);
            }
            updateItemsTable();
        }

        function calculateAmount(index) {
            const item = items[index];
            const subtotal = item.quantity * item.rate;
            const cgstAmount = subtotal * (item.cgst / 100);
            const sgstAmount = subtotal * (item.sgst / 100);
            item.amount = subtotal + cgstAmount + sgstAmount;
        }

        function removeItem(index) {
            items.splice(index, 1);
            updateItemsTable();
        }

        function generateQuotation() {
            const date = document.getElementById('date').value;
            const customerName = document.getElementById('customerName').value;
            const customerAddress = document.getElementById('customerAddress').value;
            const productName = document.getElementById('productName').value;
            const termsAndConditions = document.getElementById('termsAndConditions').value;

            let subtotal = 0;
            let totalCGST = 0;
            let totalSGST = 0;

            const itemsHTML = items.map((item, index) => {
                subtotal += item.quantity * item.rate;
                const cgstAmount = item.quantity * item.rate * (item.cgst / 100);
                const sgstAmount = item.quantity * item.rate * (item.sgst / 100);
                totalCGST += cgstAmount;
                totalSGST += sgstAmount;
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            ${item.description || 'N/A'}<br>
                            Make: ${item.make || 'N/A'}<br>
                            Warranty: ${item.warranty || 'N/A'}<br>
                            HSN: ${item.hsn || 'N/A'}
                        </td>
                        <td>${item.quantity} Nos.</td>
                        <td>${item.rate.toFixed(2)}</td>
                        <td>${item.cgst}%</td>
                        <td>${item.sgst}%</td>
                        <td>${item.amount.toFixed(2)}</td>
                    </tr>
                `;
            }).join('');

            const total = subtotal + totalCGST + totalSGST;

            const quotationHTML = `
                <div class="letterhead">
                    <h2 style="color: #e74c3c;">HAL POWER CONVERSION</h2>
                    <p>No.13/7, Kalaimagal Street, Anna Nedum Pathi, Choolaimedu, Chennai-600 094</p>
                    <p>Email: halpowerconversion@gmail.com • Phone: 9962614327</p>
                    <p>GSTIN: 33AJXPC6356P1ZG</p>
                </div>
                <p>Date: ${date}</p>
                <div class="address">
                    <p>To,<br>
                    M/S. ${customerName}<br>
                    ${customerAddress}</p>
                </div>
                <p>Dear Sir,</p>
                <p>Subject: Commercial offer for your ${productName} Requirement.</p>
                <p>In reference to our recent discussion regarding your ${productName} offer.
                We please to enclose our best proposal for your kind consideration.</p>
                <p>Should you require any further clarification or additional information, please do not hesitate to
                contact us. We sincerely appreciate the opportunity and look forward to the privilege of receiving
                your order.</p>
                <p>Best regards,<br>
                For: HAL Power Conversion</p>
                <div class="signature">
                    <p>Halden<br>
                    (Mobile: +91 99626 14327)</p>
                </div>
                <h2>Quotation</h2>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item & Description</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>CGST</th>
                            <th>SGST</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="6" style="text-align: right;"><strong>Sub Total</strong></td>
                            <td>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: right;"><strong>CGST</strong></td>
                            <td>${totalCGST.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: right;"><strong>SGST</strong></td>
                            <td>${totalSGST.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="6" style="text-align: right;"><strong>Total</strong></td>
                            <td><strong>₹${total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <div class="terms">
                    <h3>Terms and Conditions:</h3>
                    <pre>${termsAndConditions}</pre>
                </div>
            `;

            document.getElementById('quotationPreview').innerHTML = quotationHTML;
        }

        async function saveAsPDF() {
            if (!document.getElementById('quotationPreview').innerHTML) {
                alert('Please generate a quotation first.');
                return;
            }

            const customerName = document.getElementById('customerName').value || 'quotation';
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const element = document.getElementById('quotationPreview');
            let scale = 2;
            let pdfOutput;

            do {
                const canvas = await html2canvas(element, {scale: scale});
                const imgData = canvas.toDataURL('image/jpeg', 0.7);

                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                doc.addImage(imgData, 'JPEG', 0,position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdfOutput = doc.output('blob');
                scale -= 0.1;
            } while (pdfOutput.size > 2 * 1024 * 1024 && scale > 0.5);

            if (pdfOutput.size <= 2 * 1024 * 1024) {
                doc.save(`${customerName}.pdf`);
            } else {
                alert('Unable to generate a PDF under 2MB. Please reduce the content or split it into multiple quotations.');
            }
        }

        function printQuotation() {
            if (!document.getElementById('quotationPreview').innerHTML) {
                alert('Please generate a quotation first.');
                return;
            }
            window.print();
        }

        // Initialize with one empty item
        addItem();