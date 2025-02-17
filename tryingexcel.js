/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NAmdConfig ./lib/JsLibraryConfig.json
 */
define(['N/file', 'sheetjs'], function(file, sheetjs) {
    function onRequest(context) {
        if (context.request.method === 'GET') {
            try {

                log.error('XLSX Object', sheetjs); // Log the XLSX object
                if (!sheetjs || !sheetjs.utils) {
                    context.response.write('SheetJS is not available');
                    
                }
            var wb = sheetjs.utils.book_new();




            var ws = sheetjs.utils.aoa_to_sheet(ws_data);

            sheetjs.utils.book_append_sheet(wb, ws, "sheet1");

            var wbout = sheetjs.write(wb, { bookType: 'xlsx', type: 'base64' });

            var newFile = file.create({
                name: 'newFile.xlsx',
                fileType: file.Type.EXCEL,
                contents: wbout
            });

            


            context.response.writeFile(newFile, true);

        } catch (e) {
            log.error({
                title: 'Error',
                details: e
            });

            context.response.write('Error creating Excel file: ' + e.message);

        }}
    }

    return {
        onRequest: onRequest
    };
});