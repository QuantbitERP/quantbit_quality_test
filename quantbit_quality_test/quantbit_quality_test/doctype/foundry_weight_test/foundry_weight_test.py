# Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
def GetVal(value):
    return value if value else 0

class FoundryWeightTest(Document):
	
	@frappe.whitelist()
	def cavity_standard(self):
		if self.pouring_id:
			weight_details = self.get("weight_details")
			for row in weight_details:
				quantity ,weight,total_weight= frappe.get_value('Pouring Casting Details',{'parent':self.pouring_id,'casting_item_code':row.item_code}, ["sum(quantity) as quantity","sum(weight) as weight","sum(total_weight) as total_weight"])
				row.quantity = quantity
				row.standard_weight = weight
				row.weight = total_weight
					
		else:
			frappe.throw("Please Select Pouring ID First...")
     
	@frappe.whitelist()
	def average_weight_calculation(self):
		for row in self.get("weight_details"):
			# Filter and sum valid readings in one step
			readings = [GetVal(x) for x in [row.reading_1, row.reading_2, row.reading_3, row.reading_4, row.reading_5] if GetVal(x)]

			# Calculate average weight
			avg_weight = sum(readings) / len(readings) if readings else 0
			row.average_weight = avg_weight

			# Use standard weight if available, else set results to 0
			standard_weight = GetVal(row.standard_weight) or 0
			row.extra_weight = avg_weight - standard_weight if standard_weight else 0
			row.wt_value = (avg_weight / standard_weight * 100) if standard_weight else 0

		

	@frappe.whitelist()
	def set_filters_for_items(self):
		query = """
			SELECT DISTINCT casting_item_code
			FROM `tabPouring Casting Details`
			WHERE parent = %s
			AND `check` = 1
		"""
		result = frappe.db.sql(query, (self.pouring_id,), as_list=True)
		final_listed = [r[0] for r in result]
		return final_listed
