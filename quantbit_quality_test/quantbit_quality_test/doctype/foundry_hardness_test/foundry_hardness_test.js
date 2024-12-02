// Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Foundry Hardness Test", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('Foundry Hardness Test', {
    item_code: function(frm) {
        frm.call({
            method: 'part_hardness',
            doc: frm.doc
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
    pouring_id: function(frm) {
        frappe.call({
            method: 'set_filters_for_items',
            doc: frm.doc,
            callback: function(r) {
                if (r.message) {
                    var filtered_items = r.message;
                    frm.set_query("item_code", "hardness_details", function(doc, cdt, cdn) {
                        return {
                            filters: [
                                ['Item', 'name', 'in', filtered_items],
                                ['Item', 'company', '=', doc.company]
                            ]
                        };
                    });
                }
            }
        });
    },
   
});

frappe.ui.form.on('Foundry Hardness Test Details', {
    item_code: function(frm) {
        frm.call({
            method: 'part_hardness',
            doc: frm.doc
        });
    },
    reading_1: function(frm) { updateAverageWeight(frm); },
    reading_2: function(frm) { updateAverageWeight(frm); },
    reading_3: function(frm) { updateAverageWeight(frm); },
    reading_4: function(frm) { updateAverageWeight(frm); },
    reading_5: function(frm) { updateAverageWeight(frm); }
});

function updateAverageWeight(frm) {
    frm.call({
        method: 'average_weight_calculation',
        doc: frm.doc
    });
}
