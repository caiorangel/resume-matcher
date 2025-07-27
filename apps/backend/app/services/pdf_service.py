import logging
from typing import Dict, Any
from io import BytesIO
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm, cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Line, Rect
from reportlab.platypus.flowables import HRFlowable
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate
from reportlab.platypus.frames import Frame

logger = logging.getLogger(__name__)


class PDFService:
    """Service for generating PDF resumes from resume data."""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        
        # Professional color palette - define BEFORE using in styles
        self.primary_color = colors.HexColor('#1a365d')      # Deep blue
        self.secondary_color = colors.HexColor('#2b77ad')    # Medium blue  
        self.accent_color = colors.HexColor('#e2e8f0')       # Light gray
        self.text_color = colors.HexColor('#2d3748')         # Dark gray
        self.light_text = colors.HexColor('#4a5568')         # Medium gray
        
        # Setup styles AFTER colors are defined
        self._setup_custom_styles()
    
    def _setup_custom_styles(self):
        """Setup professional custom styles for the resume PDF."""
        
        # Main title - candidate name
        self.styles.add(ParagraphStyle(
            name='CandidateName',
            parent=self.styles['Title'],
            fontSize=28,
            spaceAfter=4,
            spaceBefore=0,
            alignment=TA_LEFT,
            textColor=self.primary_color,
            fontName='Helvetica-Bold',
            leading=32
        ))
        
        # Professional title
        self.styles.add(ParagraphStyle(
            name='ProfessionalTitle',
            parent=self.styles['Normal'],
            fontSize=16,
            spaceAfter=20,
            spaceBefore=0,
            alignment=TA_LEFT,
            textColor=self.secondary_color,
            fontName='Helvetica',
            leading=18
        ))
        
        # Contact information
        self.styles.add(ParagraphStyle(
            name='ContactInfo',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=24,
            spaceBefore=0,
            alignment=TA_LEFT,
            textColor=self.light_text,
            fontName='Helvetica',
            leading=12
        ))
        
        # Section headers
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=20,
            alignment=TA_LEFT,
            textColor=self.primary_color,
            fontName='Helvetica-Bold',
            borderWidth=0,
            borderColor=self.accent_color,
            leading=16,
            leftIndent=0
        ))
        
        # Professional summary
        self.styles.add(ParagraphStyle(
            name='Summary',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=16,
            spaceBefore=0,
            alignment=TA_JUSTIFY,
            textColor=self.text_color,
            fontName='Helvetica',
            leading=16,
            firstLineIndent=0
        ))
        
        # Job titles
        self.styles.add(ParagraphStyle(
            name='JobTitle',
            parent=self.styles['Normal'],
            fontSize=12,
            fontName='Helvetica-Bold',
            spaceAfter=2,
            spaceBefore=8,
            textColor=self.text_color,
            leading=14
        ))
        
        # Company names
        self.styles.add(ParagraphStyle(
            name='CompanyName',
            parent=self.styles['Normal'],
            fontSize=11,
            fontName='Helvetica-Bold',
            spaceAfter=2,
            spaceBefore=0,
            textColor=self.secondary_color,
            leading=13
        ))
        
        # Dates and locations
        self.styles.add(ParagraphStyle(
            name='DateLocation',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=8,
            spaceBefore=0,
            textColor=self.light_text,
            fontName='Helvetica',
            leading=12
        ))
        
        # Achievement bullets
        self.styles.add(ParagraphStyle(
            name='Achievement',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=3,
            spaceBefore=0,
            alignment=TA_LEFT,
            textColor=self.text_color,
            fontName='Helvetica',
            leading=14,
            leftIndent=12,
            bulletIndent=8
        ))
        
        # Education degree
        self.styles.add(ParagraphStyle(
            name='Degree',
            parent=self.styles['Normal'],
            fontSize=11,
            fontName='Helvetica-Bold',
            spaceAfter=2,
            spaceBefore=6,
            textColor=self.text_color,
            leading=13
        ))
        
        # Education institution
        self.styles.add(ParagraphStyle(
            name='Institution',
            parent=self.styles['Normal'],
            fontSize=10,
            fontName='Helvetica',
            spaceAfter=2,
            spaceBefore=0,
            textColor=self.secondary_color,
            leading=12
        ))
        
        # Skills text
        self.styles.add(ParagraphStyle(
            name='Skills',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=4,
            spaceBefore=0,
            alignment=TA_LEFT,
            textColor=self.text_color,
            fontName='Helvetica',
            leading=14
        ))
    
    def _create_section_divider(self, width=None):
        """Create a professional section divider line."""
        if width is None:
            width = 7*inch
        return HRFlowable(
            width=width,
            thickness=1,
            color=self.accent_color,
            spaceBefore=6,
            spaceAfter=12,
            hAlign='LEFT'
        )
    
    def generate_resume_pdf(self, resume_data: Dict[str, Any]) -> bytes:
        """
        Generate a professional PDF resume with excellent formatting.
        
        Args:
            resume_data: Dictionary containing resume information
            
        Returns:
            bytes: PDF file content
        """
        try:
            # Create PDF buffer
            pdf_buffer = BytesIO()
            
            # Create document with professional margins
            doc = SimpleDocTemplate(
                pdf_buffer,
                pagesize=A4,
                topMargin=0.8*inch,
                bottomMargin=0.8*inch,
                leftMargin=0.8*inch,
                rightMargin=0.8*inch,
                title="Professional Resume"
            )
            
            # Extract personal information
            personal_info = resume_data.get('personalInfo', {})
            name = personal_info.get('name', 'Professional Resume')
            title = personal_info.get('title', '')
            email = personal_info.get('email', '')
            phone = personal_info.get('phone', '')
            location = personal_info.get('location', '')
            website = personal_info.get('website', '')
            linkedin = personal_info.get('linkedin', '')
            
            # Build content story
            story = []
            
            # === HEADER SECTION ===
            if name and name.strip():
                story.append(Paragraph(name.upper(), self.styles['CandidateName']))
            
            if title and title.strip():
                story.append(Paragraph(title, self.styles['ProfessionalTitle']))
            
            # Professional contact information layout
            contact_parts = []
            if email:
                contact_parts.append(f"✉ {email}")
            if phone:
                contact_parts.append(f"☎ {phone}")
            if location:
                contact_parts.append(f"📍 {location}")
            if linkedin:
                linkedin_clean = linkedin.replace('linkedin.com/in/', '').replace('https://', '').replace('http://', '')
                contact_parts.append(f"🔗 LinkedIn: {linkedin_clean}")
            if website:
                website_clean = website.replace('https://', '').replace('http://', '')
                contact_parts.append(f"🌐 {website_clean}")
            
            if contact_parts:
                # Create a nice contact layout
                contact_text = "  •  ".join(contact_parts)
                story.append(Paragraph(contact_text, self.styles['ContactInfo']))
            
            # Main content divider
            story.append(self._create_section_divider())
            
            # === PROFESSIONAL SUMMARY ===
            summary = resume_data.get('summary', '')
            if summary and summary.strip():
                story.append(Paragraph("PROFESSIONAL SUMMARY", self.styles['SectionHeader']))
                story.append(self._create_section_divider())
                story.append(Paragraph(summary, self.styles['Summary']))
                story.append(Spacer(1, 16))
            
            # === PROFESSIONAL EXPERIENCE ===
            experience = resume_data.get('experience', [])
            if experience:
                story.append(Paragraph("PROFESSIONAL EXPERIENCE", self.styles['SectionHeader']))
                story.append(self._create_section_divider())
                
                for i, exp in enumerate(experience):
                    # Keep experience entries together
                    exp_content = []
                    
                    # Job title
                    job_title = exp.get('title', '')
                    if job_title:
                        exp_content.append(Paragraph(job_title.upper(), self.styles['JobTitle']))
                    
                    # Company name
                    company = exp.get('company', '')
                    if company:
                        exp_content.append(Paragraph(company, self.styles['CompanyName']))
                    
                    # Location and dates in a professional format
                    date_location_parts = []
                    if exp.get('years'):
                        date_location_parts.append(exp['years'])
                    if exp.get('location'):
                        date_location_parts.append(exp['location'])
                    
                    if date_location_parts:
                        date_location_text = "  •  ".join(date_location_parts)
                        exp_content.append(Paragraph(date_location_text, self.styles['DateLocation']))
                    
                    # Achievement bullets with professional formatting
                    descriptions = exp.get('description', [])
                    if descriptions:
                        for desc in descriptions:
                            # Clean and format the description
                            clean_desc = desc.strip()
                            if clean_desc:
                                bullet_text = f"▪ {clean_desc}"
                                exp_content.append(Paragraph(bullet_text, self.styles['Achievement']))
                    
                    # Add spacing between experiences
                    if i < len(experience) - 1:
                        exp_content.append(Spacer(1, 14))
                    
                    # Keep experience together on page
                    story.append(KeepTogether(exp_content))
                
                story.append(Spacer(1, 16))
            
            # === EDUCATION ===
            education = resume_data.get('education', [])
            if education:
                story.append(Paragraph("EDUCATION", self.styles['SectionHeader']))
                story.append(self._create_section_divider())
                
                for edu in education:
                    edu_content = []
                    
                    # Degree
                    degree = edu.get('degree', '')
                    if degree:
                        edu_content.append(Paragraph(degree, self.styles['Degree']))
                    
                    # Institution
                    institution = edu.get('institution', '')
                    if institution:
                        edu_content.append(Paragraph(institution, self.styles['Institution']))
                    
                    # Years
                    years = edu.get('years', '')
                    if years:
                        edu_content.append(Paragraph(years, self.styles['DateLocation']))
                    
                    # Description if available
                    description = edu.get('description', '')
                    if description and description.strip():
                        edu_content.append(Paragraph(description, self.styles['Achievement']))
                    
                    edu_content.append(Spacer(1, 8))
                    story.append(KeepTogether(edu_content))
                
                story.append(Spacer(1, 16))
            
            # === CORE COMPETENCIES ===
            skills = resume_data.get('skills', [])
            if skills:
                story.append(Paragraph("CORE COMPETENCIES", self.styles['SectionHeader']))
                story.append(self._create_section_divider())
                
                # Create a nice skills layout
                skills_clean = [skill.strip() for skill in skills if skill.strip()]
                if skills_clean:
                    # Group skills in rows of 3 for better formatting
                    skills_rows = []
                    for i in range(0, len(skills_clean), 3):
                        row_skills = skills_clean[i:i+3]
                        skills_rows.append("  •  ".join(row_skills))
                    
                    for row in skills_rows:
                        story.append(Paragraph(f"▪ {row}", self.styles['Skills']))
                    
                    story.append(Spacer(1, 8))
            
            # Build the PDF
            doc.build(story)
            pdf_buffer.seek(0)
            
            logger.info(f"Successfully generated professional PDF for: {name}")
            return pdf_buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating professional PDF: {str(e)}")
            raise Exception(f"Failed to generate PDF: {str(e)}")
    
    def generate_resume_pdf_from_improved_data(self, improved_data: Dict[str, Any]) -> bytes:
        """
        Generate PDF from the improved resume data structure.
        
        Args:
            improved_data: The complete improved data from the API
            
        Returns:
            bytes: PDF file content
        """
        try:
            # Extract resume preview data
            data = improved_data.get('data', {})
            resume_preview = data.get('resume_preview', {})
            
            if not resume_preview:
                raise ValueError("No resume preview data found in improved data")
            
            return self.generate_resume_pdf(resume_preview)
            
        except Exception as e:
            logger.error(f"Error generating PDF from improved data: {str(e)}")
            raise Exception(f"Failed to generate PDF from improved data: {str(e)}")