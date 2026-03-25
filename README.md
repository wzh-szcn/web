# Hospital Bypass Visualization

An interactive web visualization platform for exploring spatial and socioeconomic inequalities in hospital utilization across Chinese cities, based on mobile phone data analysis.

## Overview

This project visualizes hospital bypass behaviors and their associated costs across 11 major Chinese cities. The platform features:

- **Video Presentation** - Overview video explaining the research
- **Interactive Map** - City indicators visualization
- **Research Findings** - Key figures and insights carousel
- **Team Section** - Research team members with profile links

### Key Indicators

- **Bypass Rate (%)** - Percentage of patients who bypass their nearest hospital
- **NNHI** - Nearest Non-Nearest Hospital Index
- **Extra Travel Distance (km)** - Additional distance traveled due to bypass behavior

## Cities

The visualization includes the following cities:
- Beijing, Chengdu, Guangzhou, Haidong, Pu'er, Qiqihar, Shigatse, Shanghai, Shenzhen, Turpan, Wuhan

## Features

- **Video Section** - Research overview with video presentation
- **Interactive Map** - Powered by AMap (Gaode Map) with dark theme
- **City Boundary Display** - Automatic loading of administrative boundaries from Aliyun DataV API
- **Indicator Visualization** - Visual representation of healthcare accessibility metrics
- **Figure Carousel** - Key research findings presentation (5 figures)
- **Team Profiles** - Research team members with clickable profile links
- **Responsive Design** - Optimized for various screen sizes
- **Two-column Layout** - Modern grid layout for video and content

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Map API**: AMap (Gaode Map) JavaScript API v2.0
- **Data Source**: Aliyun DataV GeoJSON API for administrative boundaries
- **Styling**: Custom CSS with dark theme and modern grid layout

## File Structure

```
web/
├── index.html          # Main HTML document
├── script.js           # Application logic and map functionality
├── styles.css          # Styling and responsive design
├── video.jpg           # Video thumbnail/cover
└── sc/                 # Static assets
    ├── Figure/         # Research figure images (Figure 1-5)
    ├── team/           # Team member photos
    ├── 1.svg           # Shenzhen University logo
    ├── 2.jpg           # Laboratory logo
    ├── 3.jpg           # Laboratory logo
    ├── 4.png           # Partner logo
    ├── 5.jpg           # Partner logo
    └── video.jpg       # Video cover image
```

## Navigation

The website includes four main sections:
1. **Overall** - Video presentation and introduction
2. **Indicators** - Interactive city map with healthcare indicators
3. **Findings** - Research findings carousel
4. **Team** - Research team members

## Usage

1. Open `index.html` in a modern web browser
2. Watch the overview video in the Overall section
3. Navigate to Indicators to explore the interactive map
4. Hover over city markers to view indicators
5. Click on cities to zoom and view detailed information
6. Browse research findings in the Findings carousel
7. View team member profiles in the Team section

## Research Team

**Principal Investigators:**
- Qingquan Li (Professor, Shenzhen University)
- Yang Yue (Professor, Shenzhen University)
- Wei Tu (Professor, Shenzhen University)

**Collaborators:**
- Carlo Ratti (Professor, MIT)
- Michael Batty (Professor, UCL)
- Chen Zhong (Researcher, UCL)

**Research Team:**
- Jizhe Xia (PhD Candidate, Shenzhen University)
- Pei Ye, Longyan Pan, Di Zhang, Zihao Wu, Qiye Deng, Xiana Chen, Ziqian Ye (Researchers, Shenzhen University)

**Affiliations:**
- Shenzhen University
- Guangdong Key Laboratory for Urban Informatics
- Shenzhen Key Laboratory of Spatial Smart Information and Service
- MIT Senseable City Lab
- UCL Centre for Advanced Spatial Analysis

## License

All rights reserved. For research purposes only.
