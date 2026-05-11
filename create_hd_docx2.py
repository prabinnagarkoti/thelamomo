from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

doc = Document()

# Base styling
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)
style.paragraph_format.line_spacing = 1.0
style.paragraph_format.space_after = Pt(12)

def add_h1(text, author):
    h = doc.add_heading(text, level=1)
    if author:
        p = doc.add_paragraph()
        run = p.add_run(f"[Primary Contributor: {author}]")
        run.font.size = Pt(10)
        run.font.italic = True
        run.font.color.rgb = RGBColor(100, 100, 100)

def add_h2(text):
    return doc.add_heading(text, level=2)

def add_h3(text):
    return doc.add_heading(text, level=3)

def add_p(text):
    return doc.add_paragraph(text)

# Cover Page
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title.paragraph_format.space_before = Pt(80)
title_run = title.add_run('Information Systems Capstone (INF305)\nAssessment 3: Final Report\n\n')
title_run.font.size = Pt(22)
title_run.font.bold = True

info = doc.add_paragraph()
info.alignment = WD_ALIGN_PARAGRAPH.CENTER
info.add_run('Project Name: BizMenu Builder\n\n').font.bold = True
info.add_run('Group Members:\n').font.bold = True
info.add_run('Prabin Kumar Nagarkoti (AIIHE11045) - 40%\nSandip Pathak (AIIHE11055) - 30%\nKulwinder Kaur (AIIHE10483) - 30%\nGroup: G4\n\n')
info.add_run('Submission Date: Week 12').font.bold = True

doc.add_page_break()

# TOC
doc.add_heading('Table of Contents', level=1)
toc = """1. Project Background
2. Literature Review & Gap Analysis
3. Stakeholders & User Personas
4. Key Features Overview
5. System Design (Architecture, Database, Activity)
6. Wireframes & Interface Annotations
7. Product Backlog & Sprint Minutes
8. Risk Management
9. Working Prototype Workflow
10. Development & Code Snippets
11. Testing & Quality Assurance
12. Project Planning (Gantt Chart)
13. Conclusions & Future Improvements
14. References
15. Appendix (Individual Reflections)"""
add_p(toc)

doc.add_page_break()

# 1. Project Background
add_h1('1. Project Background', 'Kulwinder Kaur')
add_h2('1.1 Problem Background')
add_p('The rapid advancement of digital technology has irrevocably transformed the global food service industry. Online food delivery platforms, stimulated by recent digital transformations, have become the primary method for consumers to order food. However, this convenience for consumers has introduced intense financial and operational burdens on small, independent food businesses. Third-party aggregator platforms currently charge exorbitant commission fees ranging from 20% to 35% per order. These high fees constantly deplete the already thin profit margins of small businesses. Furthermore, restaurants are stripped of their customer data, preventing them from building direct customer loyalty programs and forcing an unhealthy reliance on monopolistic third-party platforms.')

add_h2('1.2 Purpose and Objectives')
add_p('To address this systemic issue, this project developed "BizMenu Builder," a comprehensive, commission-free minimum viable product (MVP) designed specifically for independent food vendors. The primary objective is to empower restaurant owners by providing a platform where they can launch customized, branded digital storefronts. Unlike aggregators, BizMenu Builder allows owners to fully manage their menus in real-time, process orders without paying per-transaction commissions, and retain 100% ownership of their customer data. The overarching goal is to eradicate reliance on third-party aggregators and promote digital equity for small-to-medium enterprises (SMEs).')

add_h2('1.3 Differentiation from Existing Applications')
add_p('BizMenu Builder differentiates itself by offering a zero-commission, white-labeled solution that prioritizes owner autonomy and ease of use. While existing solutions act as multi-tenant marketplaces (where the platform brand supersedes the restaurant brand), BizMenu Builder isolates the branding experience, allowing the restaurant\'s logo, colour scheme, and identity to take precedence. Furthermore, it integrates a simplified "No-Code" backend dashboard, entirely removing the IT skill barrier that typically prevents small operators from digitizing their businesses.')

# 2. Literature Review & Gap
add_h1('2. Literature Review & Gap Analysis', 'Kulwinder Kaur')
add_h2('2.1 Existing Solutions and Key Features')
add_p('The current market offers several solutions aimed at digitizing restaurant orders, but they often fall short of meeting the needs of independent SMEs. \n- UberEats / DoorDash: These multi-sided digital marketplaces provide excellent logistics and customer reach. However, their profit-seeking behavior extracts 30% commissions, rendering them unsustainable for small margins.\n- GloriaFood: Offers a "free" base model for online ordering but requires complex technical integration into an existing website, assuming the restaurant already has one.\n- ChowNow / UpMenu: These are subscription-based white-label solutions. While they do not charge per-order commissions, their high monthly subscription fees ($149 - $299/month) create a significant barrier to entry. Additionally, they require a moderate to high level of IT proficiency to configure and maintain.')

add_h2('2.2 Gap Identified and Justification for a New Application')
add_p('A critical gap identified in the current ecosystem is the lack of a truly accessible, low-cost, and low-technical-barrier ordering system. Small independent operators are currently forced into a trade-off: sacrifice 30% of revenue to aggregators, or pay high monthly fees and navigate complex IT configurations for white-label solutions. A new application is explicitly required to bridge this gap. BizMenu Builder fills this void by providing a lightweight, cloud-based, Next.js architecture that requires zero initial setup costs, no complex integration, and zero per-order commissions. By combining NextAuth for simple owner authentication and MongoDB Atlas for flexible, real-time menu schema management, BizMenu Builder democratizes digital ordering.')

# 3. Stakeholders & Personas
add_h1('3. Stakeholders & User Personas', 'Prabin Kumar Nagarkoti')
add_p('Defining the stakeholders and their specific needs forms the foundation of the system design.')

table1 = doc.add_table(rows=1, cols=4)
table1.style = 'Table Grid'
hdr1 = table1.rows[0].cells
hdr1[0].text = 'Persona Name'
hdr1[1].text = 'Role'
hdr1[2].text = 'Goals & Needs'
hdr1[3].text = 'System Interactions'

personas = [
    ('Sarah (The Owner)', 'Primary Stakeholder (Restaurant Owner)', 'Needs to update prices instantly, track live orders, and avoid commission fees. Low IT skills.', 'Logs into Admin Dashboard, edits MenuItems in real-time, updates Order status to "Delivered".'),
    ('John (The Customer)', 'Secondary Stakeholder (End User)', 'Wants a frictionless, mobile-friendly ordering experience without downloading an app.', 'Browses the public Next.js storefront, adds items to CartContext, submits checkout form.')
]
for p_name, role, goals, interactions in personas:
    r = table1.add_row().cells
    r[0].text = p_name
    r[1].text = role
    r[2].text = goals
    r[3].text = interactions

# 4. Key Features
add_h1('4. Key Features Overview', 'Prabin Kumar Nagarkoti')
add_p('The features of BizMenu Builder directly align with the gaps identified in the literature review and the user personas:\n1. Real-Time Menu Management: Addresses the owner\'s need for autonomy. Changes to MongoDB reflect instantly on the frontend without rebuilding the app.\n2. Zero-Commission Cart System: Addresses the financial gap. A custom React Context cart handles state locally before pushing directly to the database.\n3. Live Order Tracking Dashboard: Addresses operational needs. Owners see incoming orders immediately and can process them via a Kanban-style interface.\n4. Dynamic Storefront Theming: Addresses the branding gap. Owners can change primary and secondary colors (Tailwind CSS variables) via the database to match their restaurant\'s identity.')

# 5. System Design
add_h1('5. System Design', 'Sandip Pathak')
add_p('With the problem and personas defined, the following architectural decisions were made.')

add_h2('5.1 Architecture Diagram')
add_p('The architecture follows a modern, serverless Jamstack paradigm. Next.js App Router serves as both the frontend (React/Tailwind) and the API backend (Node.js). Vercel handles edge deployment and CI/CD. MongoDB Atlas serves as the cloud database, communicating with the Next.js API routes via Mongoose ODM.')
add_p('')

add_h2('5.2 Database Model (ERD)')
add_p('The database strictly follows NoSQL document relational patterns via Mongoose schemas. Proper primary (PK) and foreign key (FK) relationships are conceptually maintained.')
add_p('Entities & Relationships:\n- User (PK: _id): Stores email, password hash, role (owner/customer).\n- RestaurantConfig (PK: _id): Stores 1:1 branding data (colors, logo URL, name).\n- MenuItem (PK: _id): Stores food details. 1:N relationship with Orders.\n- Order (PK: _id): Stores customer details, total, status, and an array of embedded OrderItems (FK: menuItemId).')
add_p('')

add_h2('5.3 Activity Diagram')
add_p('The activity flow has been corrected to follow standard left-to-right conventions, depicting the checkout process: Customer Browses Menu -> Adds to Cart -> Submits Checkout -> API Validates -> DB Saves -> Owner Views Dashboard -> Owner Marks Delivered.')
add_p('')

# 6. Wireframes
add_h1('6. Interface Designs & Annotations', 'Prabin Kumar Nagarkoti')
add_p('The user interface was designed with a mobile-first approach using Tailwind CSS. \n- Storefront Interface: Annotated with a sticky navigation bar for cart access, a hero section populated by RestaurantConfig data, and a grid layout for MenuCard components.\n- Dashboard Interface: Annotated with a sidebar for navigation (Menu / Orders / Settings), a central data table for active orders, and quick-action buttons for status updates.')
add_p('[Placeholder: Insert Wireframes/Interface Designs with clear annotations here]')

# 7. Backlog & Sprints
add_h1('7. Product Backlog & Sprint Minutes', 'Kulwinder Kaur')

table2 = doc.add_table(rows=1, cols=4)
table2.style = 'Table Grid'
hdr2 = table2.rows[0].cells
hdr2[0].text = 'Epic & User Story'
hdr2[1].text = 'Acceptance Criteria'
hdr2[2].text = 'Priority'
hdr2[3].text = 'Status'

backlog = [
    ('EP-02: As a customer, I want to browse the menu', 'Menu displays all available items, images render correctly, categories work.', 'High', 'Done'),
    ('EP-02: As a customer, I want to add items to cart', 'Cart increments, total calculates correctly, items can be removed.', 'High', 'Done'),
    ('EP-01: As an owner, I want to manage menu items', 'CRUD operations work via dashboard, DB updates immediately.', 'High', 'Done'),
    ('EP-01: As an owner, I want to update order statuses', 'Status updates from "In Process" to "Delivered" instantly.', 'High', 'Done')
]
for ep, ac, pr, st in backlog:
    r = table2.add_row().cells
    r[0].text = ep
    r[1].text = ac
    r[2].text = pr
    r[3].text = st

add_h2('Sprint Review Minutes')
add_p('Sprint 1: Set up Next.js repo and MongoDB Atlas. Decision: Use Mongoose for strict schema validation. Action Item: Fix module resolution errors.\nSprint 2: Developed frontend components (MenuCard, CartSheet). Issue: Tailwind colors not applying dynamically. Decision: Use inline style variables for dynamic DB colors.\nSprint 3: API route development and NextAuth integration. Issue: Session persistence errors. Decision: Switch to JWT strategy.\nSprint 4: Final deployment on Vercel, PDF generation, and intensive QA testing.')

# 8. Risk Management
add_h1('8. Risk Management', 'Kulwinder Kaur')
table3 = doc.add_table(rows=1, cols=3)
table3.style = 'Table Grid'
hdr3 = table3.rows[0].cells
hdr3[0].text = 'Risk Identified'
hdr3[1].text = 'Impact'
hdr3[2].text = 'Solution / Mitigation Strategy'
risks = [
    ('Deployment Failures (Vercel missing dependencies)', 'High', 'Strict tracking of package.json. Local build testing (npm run build) prior to pushing to GitHub.'),
    ('Database Connection Timeouts', 'High', 'Utilized MongoDB connection pooling in Next.js API routes to prevent exhausting connections.'),
    ('Unsecured API Routes', 'Critical', 'Implemented NextAuth server-side session checks on all /api/orders POST/PUT routes.'),
    ('Mobile UI Breakage', 'Medium', 'Adopted a strict mobile-first Tailwind approach, utilizing flexible grids and hidden scrollbars.')
]
for ri, im, so in risks:
    r = table3.add_row().cells
    r[0].text = ri
    r[1].text = im
    r[2].text = so

# 9. Prototype
add_h1('9. Working Prototype', 'Prabin Kumar Nagarkoti')
add_p('The final prototype successfully implements the core features. The workflow allows a customer to load the site, instantly view items fetched via Server-Side Rendering (SSR) for fast load times, and place orders. The owner dashboard utilizes client-side data fetching (useEffect) to continuously poll for new orders, maintaining operational efficiency.')
add_p('[Placeholder: Insert final Screenshots of the working application here]')

# 10. Development
add_h1('10. Development & Code', 'Sandip Pathak')
add_p('The application enforces consistent coding standards. The backend relies heavily on robust Mongoose schemas to prevent bad data insertion.')
add_p('Key Code Snippet (Order Schema - models/Order.ts):')
code_p = doc.add_paragraph('const OrderSchema = new Schema({\n  customerName: { type: String, required: true },\n  items: [{ menuItemId: String, qty: Number, price: Number }],\n  total: { type: Number, required: true },\n  status: { type: String, enum: ["In Process", "Delivered"], default: "In Process" }\n}, { timestamps: true });')
code_p.style = doc.styles['No Spacing']
code_p.paragraph_format.left_indent = Inches(0.5)
add_p('\nThis schema ensures that all orders strictly contain pricing arrays and default to an "In Process" status, providing strict type-safety across the JavaScript boundary.')

# 11. Testing
add_h1('11. Testing & Quality Assurance', 'Kulwinder Kaur')
table4 = doc.add_table(rows=1, cols=4)
table4.style = 'Table Grid'
hdr4 = table4.rows[0].cells
hdr4[0].text = 'Test Case'
hdr4[1].text = 'Execution Action'
hdr4[2].text = 'Expected Result'
hdr4[3].text = 'Actual Status'
tests = [
    ('TC-01: Cart State', 'Add 3 items, delete 1, refresh page', 'Total recalculates correctly, state persists', 'Passed'),
    ('TC-02: Order Submission', 'Submit checkout form with valid data', 'API returns 200 OK, DB saves document', 'Passed'),
    ('TC-03: Route Protection', 'Access /dashboard without logging in', 'Redirected back to /login page', 'Passed'),
    ('TC-04: DB Schema Validation', 'Submit order missing "total" field', 'API throws 400 Bad Request error', 'Passed')
]
for tc, ea, er, ast in tests:
    r = table4.add_row().cells
    r[0].text = tc
    r[1].text = ea
    r[2].text = er
    r[3].text = ast

# 12. Gantt
add_h1('12. Project Planning', 'Kulwinder Kaur')
add_p('A strict timeline was adhered to over the 12-week semester. The work breakdown structure (WBS) divided tasks into Requirements Gathering (Weeks 1-3), Design & DB Modeling (Weeks 4-5), Backend API Dev (Weeks 6-7), Frontend Integration (Weeks 8-10), and QA/Testing (Weeks 11-12).')
add_p('[Placeholder: Insert Gantt Chart image here]')

# 13. Conclusion
add_h1('13. Conclusions & Future Improvements', 'Prabin Kumar Nagarkoti')
add_p('The BizMenu Builder successfully addresses the critical gap in the market for an accessible, zero-commission ordering platform. It aligns perfectly with the original objective of empowering SMEs. The project demonstrates the viability of serverless Next.js architectures in replacing traditional, heavy monolithic systems.')
add_p('Future Improvements:\n1. Integration of Stripe payment gateway for digital transactions.\n2. Implementation of a native React Native mobile app wrapper.\n3. Advanced analytics dashboard forecasting inventory needs based on historical order data.')

# 14. References
add_h1('14. References', 'Kulwinder Kaur')
add_p('Ahmad, N. K. M., et al. (2024). Customer satisfaction on Foodpanda online delivery application: a systematic literature review.\nBanker, K., et al. (2016). MongoDB in Action (2nd ed.). Manning Publications.\nOcloo, E. C., et al. (2024). Digitization of small and medium-size restaurant enterprises. Cogent Business & Management.\nSubramanian, V. (2019). Pro MERN Stack: Full Stack Web App Development. Apress.')

# 15. Appendix
doc.add_page_break()
add_h1('15. Appendix: Individual Reflections', 'All Members')

add_h2('Prabin Kumar Nagarkoti (40%)')
add_p('My primary contribution revolved around the frontend architecture, UI/UX design, and overall project integration. I developed the interface wireframes, coded the React components using Tailwind CSS, and implemented the CartContext for state management. I also handled the final Vercel deployment and custom domain configurations. Learning Experience: This project drastically improved my ability to connect frontend UI with backend APIs efficiently. Understanding how to manage application state without prop-drilling was a major milestone.')

add_h2('Sandip Pathak (30%)')
add_p('I was the lead backend developer. I designed the initial system architecture diagram and the Database ERD. I implemented the Mongoose schemas in MongoDB Atlas and wrote the Next.js API route handlers to process orders securely. I also integrated the NextAuth authentication system. Learning Experience: I learned the critical importance of backend validation and securing API endpoints. Designing a NoSQL database schema that scales correctly was a highly rewarding challenge.')

add_h2('Kulwinder Kaur (30%)')
add_p('I spearheaded the analysis, project management, and quality assurance. I conducted the literature review, identified the market gaps, and defined the user personas. I managed the Agile sprints, maintained the product backlog, developed the comprehensive test cases, and authored the risk management and testing summary sections. Learning Experience: I gained profound insight into how crucial rigorous testing and clear documentation are to the software development lifecycle. Translating business requirements into actionable technical user stories was my biggest takeaway.')

doc.save(r"C:\Users\PRABIN\Desktop\thelamomo\G5_INF305_A3_Final_Report_HD.docx")
print("HD level native docx generated successfully.")
