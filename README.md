# Steps to Use SheetJS in NetSuite

## Step 1: Open File Cabinet and Create a New Folder
1. **Navigate to File Cabinet**:
   - Log in to your NetSuite account.
   - Go to `Documents` > `Files` > `File Cabinet`.

2. **Create a New Folder**:
   - In the File Cabinet, navigate to the `SuiteScripts` folder.
   - Create a new folder named `lib`.

## Step 2: Add Configuration and Library Files
1. **Add `JsLibraryConfig.json`**:
   - In the `lib` folder, create a new file named `JsLibraryConfig.json`.
   - Add the following content to `JsLibraryConfig.json`:
     ```json
     {
       "paths": {
         "sheetjs": "./xlsx.full.min.js"
       }
     }
     ```

2. **Add `xlsx.full.min.js`**:
   - Upload the `xlsx.full.min.js` file to the `lib` folder in the File Cabinet.

## Step 3: Reference SheetJS in Your SuiteScript
1. **Create or Edit SuiteScript**:
   - Navigate to `Customization` > `Scripting` > `Scripts` > `New` in NetSuite.
   - Choose the script type (e.g., Scheduled Script, Suitelet) and click `Next`.
   - Provide a name and ID for your script, then click `Save`.

2. **Reference `JsLibraryConfig.json`**:
   - In the script file, add the following line at the top to reference the JSON configuration file:
     ```javascript
     /**
      * @NAmdConfig ./JsLibraryConfig.json
      */
     ```

3. **Define the Script**:
   - Use the `define` function to load the necessary modules and SheetJS.
   - Example SuiteScript:
     ```javascript
     /**
      * @NApiVersion 2.x
      * @NAmdConfig ./JsLibraryConfig.json
      * @NScriptType Suitelet
      */
     define(['N/file', 'N/ui/serverWidget', 'sheetjs'], function(file, serverWidget, XLSX) {
       function onRequest(context) {
         if (context.request.method === 'GET') {
           // Create a form with a download button
           var form = serverWidget.createForm({
             title: 'Download Excel File'
           });
           form.addSubmitButton({
             label: 'Download'
           });
           context.response.writePage(form);
         } else {
           try {
             // Create a new workbook
             var wb = XLSX.utils.book_new();

             // Create a new worksheet
             var ws_data = [
               ['Hello', 'World'],
               [1, 2],
               [3, 4]
             ];
             var ws = XLSX.utils.aoa_to_sheet(ws_data);

             // Add the worksheet to the workbook
             XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

             // Write the workbook to a Base64 string
             var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

             // Create a new file in NetSuite
             var newFile = file.create({
               name: 'SampleExcelFile.xlsx',
               fileType: file.Type.EXCEL,
               contents: wbout
             });

             // Serve the file for download
             context.response.writeFile(newFile, true);
           } catch (e) {
             log.error('Error creating Excel file', e);
             context.response.write('Error creating Excel file: ' + e.message);
           }
         }
       }

       return {
         onRequest: onRequest
       };
     });
     ```

## Step 4: Deploy and Run the Script
1. **Deploy the Suitelet**:
   - Navigate to the script record in NetSuite.
   - Go to the `Deployments` subtab and click `Edit`.
   - Set the deployment settings (e.g., status, parameters) and click `Save`.
   - Note the external URL of the Suitelet, which you will use to access the Suitelet.

2. **Access the Suitelet URL**:
   - Open a web browser and navigate to the external URL of the Suitelet.
   - You should see a form with a "Download" button.

3. **Download the File**:
   - Click the "Download" button to generate the Excel file and prompt the user to download it.

By following these steps, you can successfully use SheetJS in NetSuite to create and manage Excel sheets.
