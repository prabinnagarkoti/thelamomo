from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Define styles
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(12)

# Title Page
title = doc.add_paragraph()
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
title.paragraph_format.space_before = Pt(100)
title_run = title.add_run('Information Systems Capstone (INF305)\nAssessment 3: Final Report')
title_run.font.size = Pt(24)
title_run.font.bold = True

info = doc.add_paragraph()
info.alignment = WD_ALIGN_PARAGRAPH.CENTER
info.paragraph_format.space_before = Pt(40)
info.add_run('Project Name: BizMenu Builder\n\n\n').font.bold = True
info.add_run('Group Members:\n').font.bold = True
info.add_run('Prabin Kumar Nagarkoti (AIIHE11045) - 40%\nSandip Pathak (AIIHE11055) - 30%\nKulwinder Kaur (AIIHE10483) - 30%\nGroup: G4\n\n')
info.add_run('Submission Date: ').font.bold = True
info.add_run('Week 12')

doc.add_page_break()

# TOC
doc.add_heading('Table of Contents', 1)
toc_text = (
    "1. Project Background\n"
    "2. Literature Review\n"
    "3. Design\n"
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
doc.add_paragraph(toc_text)

doc.add_page_break()

def add_h2(text):
    doc.add_heading(text, level=2)

def add_h3(text):
    doc.add_heading(text, level=3)

def add_p(text):
    doc.add_paragraph(text)

add_h2('1. Project Background')
add_h3('1.1 Problem Background')
add_p('The rapid advancement of digital technology has essentially changed the way consumers avail food delivery services worldwide. Online food delivery platforms have gained immense popularity, stimulated by the digital transformation. However, these platforms combine intense financial and operational burdens on small independent food businesses. The commissions charged by third-party platforms often range between 20-35% on a per-order basis. As profit margins are constantly depleted by commission fees, these small businesses struggle to build direct customer loyalty programs or maintain sustainable profitability.')

add_h3('1.2 Project Objectives')
add_p('The BizMenu Builder is developed as a comprehensive minimum viable product designed to empower independent food vendors. The primary objective is to provide a platform that allows entrepreneurs to have branded profiles with custom logos and colour schemes. Live menu management allows owners to make real-time updates to item prices, descriptions, and availability. Furthermore, customers can browse menus, search, and place orders using a branded storefront on a commission-free basis. The overarching goal is to provide a white-label, robust ordering system that eradicates the reliance on third-party aggregators.')

add_h3('1.3 Stakeholders and Significance')
add_p('Small food business owners are the primary stakeholders, obtaining financial independence and full control over their customer data. Secondary stakeholders include the customers who benefit directly from a smooth, personally branded, and direct ordering process without hidden middleman fees. The project is significant as it targets the problem of digital inequity that currently affects small-to-medium food businesses operating in the competitive Australian food service industry.')

add_h2('2. Literature Review')
add_h3('2.1 Analysis of Existing Solutions, Technologies, and Methods')
add_p('The global online food delivery market has grown at an impressive rate over the last decade. Services like Uber Eats and DoorDash are multi-sided digital marketplaces that unite customers, restaurants, and couriers. However, this powerful marketplace paradigm subjects small independent food enterprises to financial and operational drawbacks due to aggressive profit-seeking behavior and monopolistic practices.')

add_h3('2.2 Existing Solutions')
add_p('Current white-label substitutes, such as GloriaFood, ChowNow, and UpMenu, enable restaurants to roll out uniquely labeled order websites on a monthly subscription framework. However, the successful digitization of business performance for restaurant SMEs heavily depends on the owner\'s IT skills. This technical obstacle makes most of the currently existing white-label platforms inaccessible to operators who lack specialized IT knowledge. Furthermore, many of these solutions are multi-tenant rather than offering a fully isolated private environment.')

add_h3('2.3 Technologies Selected and Justification')
add_p('In an attempt to address the identified accessibility and usability limitations, BizMenu Builder implements a modern full-stack JavaScript architecture based on Next.js, MongoDB, and Tailwind CSS. Next.js was selected as the main framework because it combines frontend React components and backend API routes into a single codebase, streamlining deployment. The App Router architecture supports server-side rendering, optimizing performance and SEO. MongoDB Atlas and Mongoose were chosen for database management, providing a flexible, NoSQL document-based structure perfect for dynamic menu items and order records. Vercel serves as the deployment platform, offering zero-configuration deployment, built-in CI/CD integration with GitHub, and serverless edge computing, reducing infrastructure costs for small operators.')

add_h2('3. Design')
add_h3('3.1 Architecture Diagram')
add_p('BizMenu Builder utilizes a scalable full-stack architecture. Users communicate with the application via web or mobile browsers via HTTPS. The frontend layer, managed with React Context and Next.js, handles the UI, cart system, and authentication. Next.js API routes operate as the backend layer, performing business logic and request validation before communicating with MongoDB via Mongoose ODM. The entire application is deployed seamlessly on Vercel.')

add_h3('3.2 Database Models')
add_p('The database is built on MongoDB Atlas. The core collections include:\n'
      '- User: Handles roles (customer, owner) and authentication.\n'
      '- MenuItem: Stores food information (name, price, image, availability, category).\n'
      '- Order: Manages customer information, ordered items, quantities, total price, and real-time order status tracking.\n'
      '- RestaurantConfig: Contains branding parameters (restaurant name, logo URL, colors, theme mode, operating hours).')

add_h3('3.3 Wireframes / UI Prototypes')
add_p('The application was developed based on mobile-first wireframes to ensure responsiveness. The customer interface features a clean homepage highlighting "Today\'s Selection" in a card-based layout, displaying high-quality images, descriptions, prices, and an intuitive "Add to Cart" function. The admin interface wireframe provides a functional dashboard for restaurant owners, featuring analytics on active orders, revenue, and quick actions to manage menu items efficiently.')

add_h2('4. Product Backlog & Sprint Review Minutes')
add_h3('4.1 Epics and User Stories')
add_p('The project was divided into three main epics: EP-01 (Restaurant Owner Management), EP-02 (Customer Ordering Experience), and EP-03 (Backend Infrastructure). Key user stories included:\n'
      '- As a customer, I want to browse the menu so I can decide what to order. (High Priority - Done)\n'
      '- As a customer, I want to add items to my cart and place an order. (High Priority - Done)\n'
      '- As a restaurant owner, I want to add, edit, and delete menu items from my dashboard. (High Priority - Done)\n'
      '- As a restaurant owner, I want to customize the colors and branding of my storefront. (Medium Priority - Done)')

add_h3('4.2 Sprint Review Minutes')
add_p('Sprint 1: Focused on project setup, MongoDB Atlas integration, and defining Mongoose schemas. Decision: Adopted Next.js App Router for simplified deployment.\n'
      'Sprint 2: Focused on frontend deployment on Vercel and completing the customer menu interface. Action Item: Implement Cart Context for state management.\n'
      'Sprint 3: Focused on Order Management Dashboard and authentication. Resolved issues with NextAuth session management.\n'
      'Sprint 4: Focused on UI polish, PDF receipt generation, and real-time status updates. Conducted extensive testing.')

add_h2('5. Risk Management')
add_h3('5.1 Issues Encountered and Solutions')
add_p('During development, initial Vercel deployments failed due to incorrect module import paths and missing dependencies. This was resolved by meticulously verifying relative paths and ensuring package.json was up to date. Additionally, integrating third-party APIs (such as email services) presented latency issues, which were mitigated by utilizing asynchronous background processing.')

add_h3('5.2 Potential Risks and Mitigation Strategies')
add_p('- Database Connection Failure: Mitigated by using robust environment variables and implementing connection pooling in Mongoose.\n'
      '- Security Exposure: All sensitive credentials (DB URI, Auth secrets) are stored in .env.local files and protected via Vercel\'s secure environment variable management.\n'
      '- Performance Bottlenecks: Mitigated by leveraging Next.js server-side rendering and optimizing database queries using specific indexes.')

add_h2('6. Working Prototype')
add_h3('6.1 Features Implemented')
add_p('The final working prototype includes a fully functional customer storefront with an intuitive cart system, dynamic theming, and an interactive menu. The Owner Dashboard allows administrators to track orders in real-time, view analytics (revenue, active orders), and seamlessly edit the menu or restaurant configuration settings. Users can also download PDF order summaries.')

add_h3('6.2 Prototype Workflow')
add_p('A customer arrives at the customized storefront, browses categorized menu items, and adds dishes to their cart. Upon checkout, they provide delivery details and confirm the order. The order is instantly saved to MongoDB, and the restaurant owner receives a notification on their dashboard. The owner can then process the order, update the status to "Delivered", and the dashboard analytics update automatically.')

add_h2('7. Development')
add_h3('7.1 Key Code Snippets and Details')
add_p('The backend logic heavily utilizes Next.js API routes. For instance, the Order creation route validates customer input and securely inserts the document into MongoDB using Mongoose. The frontend utilizes React Context (CartContext) to manage the shopping cart state efficiently across all components without prop drilling, ensuring a seamless user experience during checkout.')

code_p = doc.add_paragraph()
code_p.add_run('// Example: Cart State Management\nconst addToCart = (item: Item, isLoggedIn: boolean) => {\n  if (!isLoggedIn) {\n    setAuthPrompt(true); setOpen(true); return;\n  }\n  setCart((prev) => {\n    const existing = prev.find((i) => i.id === item.id);\n    if (existing) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));\n    return [...prev, item];\n  });\n  setOpen(true);\n};')
code_p.style = doc.styles['No Spacing']
code_p.paragraph_format.left_indent = Inches(0.5)

add_h2('8. Testing & Quality Assurance')
add_h3('8.1 Test Cases and Execution Summary')
add_p('Comprehensive manual and automated testing was conducted across different environments. Key test cases included:\n'
      '- TC01 (Cart functionality): Verified that users can add, remove, and adjust quantities of items. Result: Passed.\n'
      '- TC02 (Checkout Process): Verified that valid orders are successfully saved to the database and clear the cart upon success. Result: Passed.\n'
      '- TC03 (Dashboard Updates): Verified that the admin dashboard reflects new orders instantaneously without requiring a manual refresh. Result: Passed.\n'
      '- TC04 (Authentication): Verified that unauthorized users cannot access the /dashboard routes. Result: Passed.')

add_h2('9. Conclusions')
add_p('The BizMenu Builder capstone project successfully achieved its original objectives. The team developed a robust, scalable, and commission-free ordering platform tailored for small independent food businesses. By utilizing a modern tech stack (Next.js, MongoDB, Tailwind CSS), the application delivers high performance and an exceptional user experience. Lessons learned include the importance of rigorous state management in React, the benefits of serverless deployment via Vercel, and the necessity of proactive risk management during the software development lifecycle.')

add_h2('10. Future Improvements')
add_p('Suggestions for future enhancements include:\n'
      '- Integrating a secure online payment gateway (e.g., Stripe) to support credit card transactions.\n'
      '- Developing a native mobile application version using React Native.\n'
      '- Implementing advanced AI-driven analytics to predict order volumes and recommend inventory stocking levels to restaurant owners.\n'
      '- Adding a comprehensive review and rating system for individual menu items.')

add_h2('11. References')
add_p('Ahmad, N. K. M., et al. (2024). Customer satisfaction on Foodpanda online delivery application: a systematic literature review.\n'
      'Banker, K., et al. (2016). MongoDB in Action (2nd ed.). Manning Publications.\n'
      'Subramanian, V. (2019). Pro MERN Stack: Full Stack Web App Development. Apress.\n'
      'Lehmann, J., & Recker, J. (2022). Offerings That are "Ever-in-the-Making". Business & Information Systems Engineering.')

doc.add_page_break()

add_h2('12. Appendix')
add_h3('Individual Reflections')

add_h3('Prabin Kumar Nagarkoti (40%)')
add_p('Contribution: I took the lead on the frontend architecture and UI/UX design. I implemented the Tailwind CSS styling, created the Cart Context for state management, and developed the overall structural layout in Next.js. I also handled the Vercel deployment and domain configuration.\n'
      'Learning Experience: This project significantly deepened my understanding of Next.js App Router and server-side rendering. I learned how to build highly responsive, mobile-first interfaces and manage complex application state effectively.')

add_h3('Sandip Pathak (30%)')
add_p('Contribution: I was responsible for the backend development and database integration. I designed the MongoDB schemas using Mongoose, created the RESTful API routes for orders and menu items, and implemented the authentication flows.\n'
      'Learning Experience: Working extensively with MongoDB and Mongoose taught me how to structure NoSQL databases efficiently. I also gained valuable experience in securing API endpoints and handling asynchronous data fetching in a serverless environment.')

add_h3('Kulwinder Kaur (30%)')
add_p('Contribution: I focused on the testing, documentation, and quality assurance phases of the project. I developed the comprehensive test cases, managed the product backlog in our Agile sprints, and authored significant portions of the project documentation including the literature review and risk management plans.\n'
      'Learning Experience: This project enhanced my skills in software project management and QA methodologies. I learned the critical importance of maintaining thorough sprint documentation and aligning technical development with business requirements.')

doc.save(r"C:\Users\PRABIN\Desktop\thelamomo\G5_INF305_A3_Final_Report.docx")
print("Native docx file generated successfully.")
