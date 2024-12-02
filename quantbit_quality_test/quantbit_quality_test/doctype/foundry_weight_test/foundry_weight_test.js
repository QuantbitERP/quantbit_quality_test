// Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Foundry Weight Test", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Foundry Weight Test', {
    pouring_id: function(frm) {
            frappe.call({
                method: 'set_filters_for_items',
                doc: frm.doc,
                callback: function(r) {
                    if (r.message) {
                        var k = r.message;
                        frm.set_query("item_code", "weight_details", function(doc, cdt, cdn) {
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

frappe.ui.form.on('Foundry Weight Test Details', {
    item_code: function(frm) {
        frm.call({
            method: 'cavity_standard',
            doc: frm.doc
        });
    },
    reading_1: function(frm) { updateAverageWeight(frm); },
    reading_2: function(frm) { updateAverageWeight(frm); },
    reading_3: function(frm) { updateAverageWeight(frm); },
    reading_4: function(frm) { updateAverageWeight(frm); },
    reading_5: function(frm) { updateAverageWeight(frm); }
});

// Consolidated function to calculate average weight
function updateAverageWeight(frm) {
    frm.call({
        method: 'average_weight_calculation',
        doc: frm.doc
    });
}