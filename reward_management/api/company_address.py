import frappe
from frappe.model.document import Document

@frappe.whitelist()
def get_company_address():
    # Fetch fields from the single doctype
    # company_address = frappe.db.get_single_value("Company Address", "address")
    company_address = frappe.db.get_single_value("Company Address","company_address")
    company_email = frappe.db.get_single_value("Company Address", "email")
    company_website = frappe.db.get_single_value("Company Address", "website")
    about_company = frappe.db.get_single_value("Company Address","about_company")
    company_name = frappe.db.get_single_value("Company Address","company_name")
    description = frappe.db.get_single_value("Company Address","description")
    
    # Fetch child table data
    company_mobile_data = frappe.get_all(
        "Company Mobile Child", 
        filters={"parent": "Company Address"},
        fields=["mobile_number"]
    )
    
    # Prepare the response dictionary
    response = {
        "company_name": company_name,
        "description": description,
        # "address": company_address,
        "company_address":company_address,
        "email": company_email,
        "website": company_website,
        "about_company":about_company,
        "mobile_numbers": [entry["mobile_number"] for entry in company_mobile_data]
    }
    
    return response

# # update or add new company address--------

# @frappe.whitelist()
# def add_or_update_company_address(company_name, company_address, email, website, mobile_numbers, about_company):
#     try:
#         current_user = frappe.session.user
        
#          # Get current user's roles
#         user_roles = frappe.get_roles(current_user)

#         # Allow only Administrator or users with "Admin" role
#         if current_user != "Administrator" and "Admin" not in user_roles:
#             return {"success": False, "message": "Permission denied"}
#         # Check if the company address already exists (Assuming it's a single doctype)
#         # company_address_doc = frappe.db.get_single_value("Company Address", "address")
#         company_address_doc = frappe.db.get_single_value("Company Address",company_name)

#         if company_address_doc:
#             # If the company address exists, fetch the document
#             company_address_doc = frappe.get_doc("Company Address", company_address_doc)
#             # company_address_doc.address = address
#             company_address_doc.company_name = company_name
#             company_address_doc.company_address = company_address
#             company_address_doc.email = email
#             company_address_doc.website = website
#             company_address_doc.about_company = about_company  # Update About Us if applicable

#             # Clear existing mobile numbers before adding new ones
#             company_address_doc.set("mobile", [])

#             # Filter out mobile numbers that are not 10 digits
#             valid_mobiles = [mobile for mobile in mobile_numbers if len(mobile) == 10]

#             if valid_mobiles:
#                 # Iterate over each valid mobile and add them to the child table as separate entries
#                 for mobile in valid_mobiles:
#                     company_address_doc.append("mobile", {"mobile_number": mobile})

#             company_address_doc.save(ignore_permissions=True)

#             return {'status': 'success', 'message': 'Company Address updated successfully.'}

#         else:
#             # If no document exists, create a new one
#             new_address_doc = frappe.get_doc({
#                 'doctype': 'Company Address',
#                 'company_name':company_name,
#                 'company_address': company_address,
#                 'email': email,
#                 'website': website,
#                 'about_company': about_company  # Add About Us if applicable
#             })

#             # Filter out mobile numbers that are not 10 digits
#             valid_mobiles = [mobile for mobile in mobile_numbers if len(mobile) == 10]

#             if valid_mobiles:
#                 # Add each valid mobile number to the child table as separate entries
#                 for mobile in valid_mobiles:
#                     new_address_doc.append("mobile", {"mobile_number": mobile})

#             new_address_doc.insert(ignore_permissions=True)

#             return {'status': 'success', 'message': 'Company Address created successfully.'}

#     except Exception as e:
#         # Log error for debugging
#         frappe.log_error(frappe.get_traceback(), "add_or_update_company_address")
#         return {'status': 'error', 'message': f'An error occurred: {str(e)}'}


@frappe.whitelist()
def add_or_update_company_address(company_name, company_address, email, website, mobile_numbers, about_company):
    try:
        current_user = frappe.session.user
        
        # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        
        # For Single DocType, we always use get_single() which either gets existing or creates new
        company_address_doc = frappe.get_single("Company Address")
        
        # Update fields
        company_address_doc.company_name = company_name
        company_address_doc.company_address = company_address
        company_address_doc.email = email
        company_address_doc.website = website
        company_address_doc.about_company = about_company
        
        # Clear existing mobile numbers before adding new ones
        company_address_doc.set("mobile", [])
        
        # Filter out mobile numbers that are not 10 digits
        valid_mobiles = []
        if mobile_numbers:
            if isinstance(mobile_numbers, str):
                # Handle case where mobile_numbers is a string (JSON array)
                try:
                    mobile_numbers = frappe.parse_json(mobile_numbers)
                except:
                    mobile_numbers = [mobile_numbers]
            
            valid_mobiles = [str(mobile).strip() for mobile in mobile_numbers 
                           if mobile and len(str(mobile).strip()) == 10]
        
        if valid_mobiles:
            # Iterate over each valid mobile and add them to the child table
            for mobile in valid_mobiles:
                company_address_doc.append("mobile", {"mobile_number": mobile})
        
        company_address_doc.save(ignore_permissions=True)
        
        frappe.db.commit()
        
        return {'status': 'success', 'message': 'Company Address updated successfully.'}
    
    except Exception as e:
        frappe.db.rollback()
        # Log error for debugging
        frappe.log_error(frappe.get_traceback(), "add_or_update_company_address")
        return {'status': 'error', 'message': f'An error occurred: {str(e)}'}


# add or update company name and description
@frappe.whitelist()
def add_or_update_company_name_description(company_name, description):
    try:
        current_user = frappe.session.user
        
         # Get current user's roles
        user_roles = frappe.get_roles(current_user)

        # Allow only Administrator or users with "Admin" role
        if current_user != "Administrator" and "Admin" not in user_roles:
            return {"success": False, "message": "Permission denied"}
        
        # Check if the company address already exists (Assuming it's a single doctype)
        company_doc = frappe.db.get_single_value("Company Address", "company_name")

        if company_doc:
            # If the company address exists, fetch the document
            company_address_doc = frappe.get_doc("Company Address", company_doc)
            company_address_doc.company_name = company_name
            company_address_doc.description = description
            company_address_doc.save(ignore_permissions=True)

            return {'success': True, 'message': 'Company Name and Description updated successfully.'}

        else:
            # If no document exists, create a new one
            new_address_doc = frappe.get_doc({
                'doctype': 'Company Address',
                'company_name': company_name,
                'description': description
            })

            new_address_doc.insert(ignore_permissions=True)

            return {'success': True, 'message': 'Company Name and Description created successfully.'}

    except Exception as e:
        # Log error for debugging
        frappe.log_error(frappe.get_traceback(), "add_or_update_company_name_description")
        return {'success': False, 'message': f'An error occurred: {str(e)}'}