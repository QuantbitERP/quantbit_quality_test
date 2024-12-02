# Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
def GetVal(value):
    return value if value else 0

class FoundryHardnessTest(Document):
	
	@frappe.whitelist()
	def part_hardness(self):
		if self.pouring_id:
			for row in self.get("hardness_details"):
				quantity  = frappe.get_value('Pouring Casting Details',{'parent':self.pouring_id,'casting_item_code':row.item_code}, "sum(quantity) as quantity")
				row.quantity = quantity
		else:
			frappe.throw("Please Select Pouring ID First...")

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
 
	@frappe.whitelist()
	def average_weight_calculation(self):
		for row in self.get("hardness_details"):
			# Gather all valid readings (non-zero and non-None) in a single step
			readings = [GetVal(x) for x in [row.reading_1, row.reading_2, row.reading_3, row.reading_4, row.reading_5] if GetVal(x) not in [None, 0]]	
			# Calculate average if there are valid readings, else set it to 0
			row.average_hardness = sum(readings) / len(readings) if readings else 0
