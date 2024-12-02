// Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Foundry Tensile Test", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Foundry Tensile Test', {
    pouring_id: function(frm) {
            frappe.call({
                method: 'set_filters_for_items',
                doc: frm.doc,
                callback: function(r) {
                    if (r.message) {
                        var k = r.message;
                        frm.set_query("item_code", "tensile_details", function(doc, cdt, cdn) {
                            let d = locals[cdt][cdn];
                            return {
                                filters: [
                                    ['Item', 'name', 'in', k],
									['Item', 'company', '=', doc.company]
                                ]
                            };
                        });
                    }
                }
			});
     },
     setup: function (frm) {
        frm.set_query("pouring_id", function() {
            return {
                filters: [
                    ['Pouring', 'company', '=', frm.doc.company]
                ]
            };
        });
    }, 
});  

frappe.ui.form.on('Foundry Tensile Test Details', {
    item_code: function(frm) {
        frm.call({
            method: 'cavity_standard',
            doc: frm.doc
        });
    }
});
