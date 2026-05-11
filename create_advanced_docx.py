from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

doc = Document()

# Define styles
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)

def add_h1(text):
    h = doc.add_heading(text, level=1)
    return h

def add_h2(text):
    return doc.add_heading(text, level=2)

def add_h3(text):
    return doc.add_heading(text, level=3)

def add_p(text):
    return doc.add_paragraph(text)

def add_img(img_name):
    path = os.path.join(r"C:\Users\PRABIN\Desktop\thelamomo\assignment_images", img_name)
    if os.path.exists(path):
        doc.add_picture(path, width=Inches(6.0))
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    else:
        doc.add_paragraph(f"[Image {img_name} Missing]")

# Title Page
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title.paragraph_format.space_before = Pt(100)
title_run = title.add_run('Information Systems Capstone (INF305)\nAssessment 3: Final Report\n\n')
title_run.font.size = Pt(24)
title_run.font.bold = True

info = doc.add_paragraph()
info.alignment = WD_ALIGN_PARAGRAPH.CENTER
info.add_run('Project Name: BizMenu Builder\n\n').font.bold = True
info.add_run('Group Members:\n').font.bold = True
info.add_run('Prabin Kumar Nagarkoti (AIIHE11045) - 40%\nSandip Pathak (AIIHE11055) - 30%\nKulwinder Kaur (AIIHE10483) - 30%\nGroup: G4\n\n')
info.add_run('Submission Date: Week 12').font.bold = True

doc.add_page_break()

# TOC
add_h1('Table of Contents')
toc_text = (
    "1. Project Background\n"
    "2. Literature Review\n"
    "3. Design\n"
    "   3.1 Architecture Diagram\n"
    "   3.2 Database Models\n"
    "   3.3 Activity Diagram\n"
    "   3.4 Wireframes / UI Prototypes\n"
    "4. Product Backlog & Sprint Review Minutes\n"
    "5. Risk Management\n"
    "6. Working Prototype\n"
    "7. Development\n"
    "8. Testing & Quality Assurance\n"
    "9. Conclusions\n"
    "10. Future Improvements\n"
    "11. References\n"
    "12. Appendix"
)
add_p(toc_text)
doc.add_page_break()

# Section 1
add_h1('1. Project Background')
add_h2('1.1 Problem Background')
add_p('The rapid advancement of digital technology has essentially changed the way consumers avail food delivery services worldwide. According to Huang and Siao (2023), online food delivery platforms have gained immense popularity worldwide, and this has been stimulated by the digital transformation. These platforms, however, combine intense financial and operational burdens on the small independent food businesses directly. The Commission provided by third-party platforms is 20-25% and 30-35% on a per-order basis (Chan et al., 2023). As Sharffudin and Yadav (2025) point out, the profit margins are constantly depleted by commission fees, and thus, businesses cannot build direct customer loyalty programmes.')

add_h2('1.2 Project Objectives')
add_p('BizMenu Builder will be launched as a minimum viable product at the end of the twelve-week capstone timeframe. The site will allow entrepreneurs to have branded profiles with custom logos and colour schemes. Live menu management allows the owners to do real-time updates to the prices of items, item descriptions, and availability. Customers are able to browse the menu, search, and place orders using a branded storefront on a commission-free basis. Order notification to the owner is delivered instantly, and full ownership of customer data eradicates the reliance on third parties.')

add_h2('1.3 Stakeholders and Significance')
add_p('Small food business owners are the primary stakeholders because they obtain financial independence and control over the customer data. There are secondary stakeholders such as customers who will have direct advantage of a smooth, personally branded, and commission-free ordering process. The project is directly targeting the problem of digital inequity that is dealing with small-to-medium food businesses operating in the competitive Australian food service industry.')

# Section 2
add_h1('2. Literature Review')
add_h2('2.1 Analysis of Existing Solutions, Technologies, and Methods')
add_p('The online food delivery market in the world has grown at an impressive rate in the last ten years. According to Fu et al. (2024), the services of online meal delivery now create significant social and sustainability concerns on communities in the global context. The Uber Eats platform and DoorDash are multi-sided digital marketplaces that unite customers, restaurants and couriers in one place. This powerful market place paradigm, though, always subject small independent food enterprises worldwide to financial and operational drawbacks.')

add_h2('2.2 Existing Solutions')
add_p('Online food delivery platforms are driven by profit-seeking behaviour that impacts the profitability of the small restaurant enterprises in a harmful way. Such platforms create unrealistic demands of commissions and leave independent restaurants with no choice but trade-offs of either charging more or less, service and operations. White label substitutes enable restaurants to roll out uniquely labeled order websites on a month-to-month subscription framework. In this context, owner IT skills play a critical role. This technical obstacle makes most of the currently existing white-label platforms inaccessible to operators who lack special IT knowledge or assets.')

add_h2('2.3 Technologies Selected and Justification')
add_p('In an attempt to meet the identified access and usability limitations, BizMenu Builder implements a current full-stack JavaScript design based on Next.js, MongoDB, and Tailwind CSS. Next.js has been selected as the main framework since it combines both the frontend React elements and the backend API routes into a single codebase. The Next.js App Router architecture also supports server-side rendering and static generation. MongoDB Atlas is the cloud-based NoSQL database that is implemented to impose schema checking and handle structured data operations. Vercel is the deployment platform since it is the native hosting solution of Next.js, with zero-configuration deployment, built-in CI/CD integration with GitHub, and serverless edge computing.')

# Section 3
add_h1('3. Design')
add_h2('3.1 Architecture Diagram')
add_p('BizMenu Builder is a modern full-stack architecture that is scalable. Customers and Restaurant Owners communicate with the application using either a web or mobile browser via HTTPS. The UI, cart system, and authentication are located in the Frontend Layer and manage application state with React Context and are created with Next.js and deployed on Vercel. Next.js API Routes are used in the Backend Layer to perform business logic.')
add_img('image_5_1.jpeg')

add_h2('3.2 Database Models')
add_p('BizMenu Builder database model is built based on NoSQL with MongoDB Atlas to support flexible and scalable food menu data. Mongoose is another Object Data Modelling (ODM) tool that the system uses to organize and manipulate data.')
add_p('Core collections:\n- MenuItem Collection: The basic model of the database is the MenuItem, into which all food-related information (e.g., item name, description, price, and category) is inserted.\n- Order Collection: Handles all customer orders, total amounts, and real-time statuses.\n- User Collection: Handles roles and NextAuth authentication.\n- RestaurantConfig: Contains branding information.')
add_img('image_7_3.jpeg')

add_h2('3.3 Activity Diagram')
add_p('This diagram displays the BizMenu Builder system flow of activities, interface between the user and frontend, backend and database. The operation starts with the user browsing or searching contents in the menu using the interface. This is forwarded to the backend, where validation of inputs is done.')
add_img('image_8_4.jpeg')

add_h2('3.4 Wireframes / UI Prototypes')
add_p('The BizMenu Builder application has been developed by creating wireframes to illustrate the structure and user interface of this application in advance. The primary customer interface wireframe consists of a clean homepage with highlighting the “Today’s Selection” section, where featured dishes are presented in a card-based layout.')
add_img('image_9_5.jpeg')

# Section 4
add_h1('4. Product Backlog & Sprint Review Minutes')
add_h2('4.1 Epics and Product Backlog')
add_p('The three main epics involved in the development of the BizMenu Builder project are:\nEP-01: Restaurant Owner Management\nEP-02: Customer Ordering Experience\nEP-03: Backend Infrastructure & Deployment')

# Add table for Product Backlog
table = doc.add_table(rows=1, cols=4)
table.style = 'Table Grid'
hdr_cells = table.rows[0].cells
hdr_cells[0].text = 'Epic'
hdr_cells[1].text = 'User Story'
hdr_cells[2].text = 'Priority'
hdr_cells[3].text = 'Status'

stories = [
    ('EP-02', 'As a customer, I want to browse the menu so I can decide what to order.', 'High', 'Done'),
    ('EP-02', 'As a customer, I want to add items to my cart and place an order.', 'High', 'Done'),
    ('EP-01', 'As an owner, I want to add/edit/delete menu items from my dashboard.', 'High', 'Done'),
    ('EP-01', 'As an owner, I want to customize my storefront branding.', 'Medium', 'Done'),
    ('EP-03', 'As a developer, I want to deploy the app to Vercel with MongoDB.', 'High', 'Done')
]
for ep, us, pr, st in stories:
    row_cells = table.add_row().cells
    row_cells[0].text = ep
    row_cells[1].text = us
    row_cells[2].text = pr
    row_cells[3].text = st

add_h2('4.2 Sprint Review Minutes')
add_p('Sprint 1 — Week 2\nSprint Goal: Project setup, technology selection, and initial backend integration.\nCompleted: GitHub repository created, Next.js initialized, MongoDB Atlas connected. Mongoose schemas drafted.\nDecisions: Agreed upon to use Next.js (App Router) and Vercel for deployment.\nIssues: Minor npm module resolution errors fixed.')
add_p('Sprint 2 — Week 4\nSprint Goal: Frontend deployment, customer interface completion, and cart feature initiation.\nCompleted: Customer homepage successfully launched. Cart context created.\nIssues: Vercel root directory selection issue fixed.')

# Section 5
add_h1('5. Risk Management')
add_p('During the lifecycle of the BizMenu Builder application, comprehensive risk management was implemented. Technical challenges including deployment failures were solved through proper file structure adjustments and environment variable management.')

table2 = doc.add_table(rows=1, cols=3)
table2.style = 'Table Grid'
hdr_cells2 = table2.rows[0].cells
hdr_cells2[0].text = 'Risk Category'
hdr_cells2[1].text = 'Potential Risk'
hdr_cells2[2].text = 'Mitigation Strategy'

risks = [
    ('Technical', 'Incorrect import paths or missing dependencies', 'Perform code validation before deployment; standardize relative imports.'),
    ('Database', 'MongoDB connection failure', 'Use correct environment variables and monitor Atlas connectivity metrics.'),
    ('Security', 'Exposure of sensitive data', 'Store credentials exclusively in .env files and configure NextAuth securely.'),
    ('Performance', 'Slow system response', 'Implement Next.js server-side caching and indexing on MongoDB collections.')
]
for cat, risk, mit in risks:
    row_cells2 = table2.add_row().cells
    row_cells2[0].text = cat
    row_cells2[1].text = risk
    row_cells2[2].text = mit

# Section 6
add_h1('6. Working Prototype')
add_h2('6.1 Features Implemented')
add_p('The prototype successfully implements the fully responsive customer storefront, live cart updates, and an admin dashboard for real-time order tracking and menu management.')

add_h2('6.2 Screenshots')
add_img('image_16_14.jpeg') # Customer Home Page
add_p('Figure: Customer Home Page Interface')

add_img('image_17_16.jpeg') # Admin Dashboard
add_p('Figure: Admin Dashboard for Managing Orders and Menu Items')

add_h2('6.3 Prototype Workflow')
add_p('The operational workflow begins with the user accessing the custom domain. They seamlessly browse categorized menu items rendered dynamically from MongoDB. Items are added to the Context-managed Cart. During checkout, form data is validated, and a POST request is sent to the backend API. The API creates an Order document. Instantly, the Admin Dashboard reflects the new order via state fetching, allowing the owner to update the status to "In Process" or "Delivered".')

# Section 7
add_h1('7. Development')
add_h2('7.1 Key Code Snippets and Details')
add_p('The development utilized modern React patterns. For instance, the route handlers for creating orders execute securely on the server-side via Next.js App Router.')
add_img('image_10_6.jpeg')
add_p('The image above demonstrates the Next.js API Route architecture, connecting to MongoDB and executing a POST request to save a new MenuItem or Order, complete with try-catch error handling.')

# Section 8
add_h1('8. Testing & Quality Assurance')
add_h2('8.1 Test Cases and Execution Reports')
add_p('Comprehensive testing ensured the reliability of the core components.')

table3 = doc.add_table(rows=1, cols=4)
table3.style = 'Table Grid'
hdr_cells3 = table3.rows[0].cells
hdr_cells3[0].text = 'Test Case ID'
hdr_cells3[1].text = 'Description'
hdr_cells3[2].text = 'Expected Result'
hdr_cells3[3].text = 'Actual Result / Status'

tests = [
    ('TC-01', 'Add item to Cart', 'Item appears in cart side-sheet, total updates', 'Passed'),
    ('TC-02', 'Submit Order form', 'Order saved to DB, UI redirects to success', 'Passed'),
    ('TC-03', 'Owner Login', 'Valid credentials grant access to /dashboard', 'Passed'),
    ('TC-04', 'Edit Menu Item', 'Changes reflect immediately on storefront', 'Passed')
]
for tid, desc, exp, act in tests:
    row_cells3 = table3.add_row().cells
    row_cells3[0].text = tid
    row_cells3[1].text = desc
    row_cells3[2].text = exp
    row_cells3[3].text = act

add_h2('8.2 Summary of Testing Results')
add_p('All functional, unit, and integration tests returned successful outcomes. Minor layout shifts detected during mobile responsive testing were rectified using Tailwind utility classes prior to final deployment.')

# Section 9
add_h1('9. Conclusions')
add_p('The BizMenu Builder capstone project successfully achieved its original objectives. The team developed a robust, scalable, and commission-free ordering platform tailored for small independent food businesses. By utilizing a modern tech stack (Next.js, MongoDB, Tailwind CSS), the application delivers high performance and an exceptional user experience. Lessons learned include the importance of rigorous state management in React, the benefits of serverless deployment via Vercel, and the necessity of proactive risk management during the software development lifecycle.')

# Section 10
add_h1('10. Future Improvements')
add_p('Suggestions for enhancements include:\n- Integrating a secure online payment gateway (e.g., Stripe) to support credit card transactions alongside Cash on Delivery.\n- Developing a native mobile application version using React Native or Flutter for broader ecosystem reach.\n- Implementing advanced AI-driven analytics to predict order volumes based on historical data, recommending inventory stocking levels to restaurant owners.\n- Adding a comprehensive review and rating system for individual menu items to enhance social proof and customer engagement.')

# Section 11
add_h1('11. References')
add_p('Ahmad, N. K. M., et al. (2024). Customer satisfaction on Foodpanda online delivery application: a systematic literature review.\nBanker, K., et al. (2016). MongoDB in Action (2nd ed.). Manning Publications.\nSubramanian, V. (2019). Pro MERN Stack: Full Stack Web App Development. Apress.\nLehmann, J., & Recker, J. (2022). Offerings That are "Ever-in-the-Making". Business & Information Systems Engineering.')

doc.add_page_break()

# Section 12
add_h1('12. Appendix')
add_h2('Individual Reflections')

add_h3('Prabin Kumar Nagarkoti (40%)')
add_p('Contribution: I took the lead on the frontend architecture and UI/UX design. I implemented the Tailwind CSS styling, created the Cart Context for state management, and developed the overall structural layout in Next.js. I also handled the Vercel deployment and custom domain DNS configurations to bring the platform live.\nLearning Experience: This project significantly deepened my understanding of Next.js App Router and server-side rendering. I learned how to build highly responsive, mobile-first interfaces and manage complex application state effectively without prop-drilling.')

add_h3('Sandip Pathak (30%)')
add_p('Contribution: I was responsible for the backend development and database integration. I designed the MongoDB schemas using Mongoose, created the RESTful API routes for orders and menu items, and implemented the authentication flows using NextAuth.\nLearning Experience: Working extensively with MongoDB and Mongoose taught me how to structure NoSQL databases efficiently to handle dynamic menu operations. I also gained valuable experience in securing API endpoints against unauthorized access.')

add_h3('Kulwinder Kaur (30%)')
add_p('Contribution: I focused on the testing, documentation, and quality assurance phases of the project. I developed the comprehensive test cases, managed the product backlog in our Agile sprints, and authored significant portions of the project documentation including the literature review, risk management plans, and testing summaries.\nLearning Experience: This project enhanced my skills in software project management and QA methodologies. I learned the critical importance of maintaining thorough sprint documentation and aligning technical development with the business requirements laid out in the initial project objectives.')

doc.save(r"C:\Users\PRABIN\Desktop\thelamomo\G5_INF305_A3_Final_Report_v2.docx")
print("Advanced native docx file with images and tables generated successfully.")
