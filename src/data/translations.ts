export type Language = 'id' | 'en';

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  role: string;
  tagline: string;
  description: string;
  tags: string[];
  features: string[];
  architecture: string[];
  metrics: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface TranslationData {
  nav: {
    role: string;
    about: string;
    projects: string;
    skills: string;
    contact: string;
    downloadCv: string;
    hireMe: string;
    askYogiri: string;
  };
  hero: {
    statusBadge: string;
    name: string;
    taglineBefore: string;
    taglineHighlight1: string;
    taglineMiddle: string;
    taglineHighlight2: string;
    taglineAnd: string;
    taglineHighlight3: string;
    viewProjects: string;
    downloadCv: string;
    scrollToExplore: string;
  };
  about: {
    badge: string;
    heading: string;
    bioP1: string;
    bioP1Highlight1: string;
    bioP1Middle: string;
    bioP1Highlight2: string;
    bioP1End: string;
    location: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
  projects: {
    badge: string;
    heading: string;
    subtitle: string;
    items: ProjectData[];
    modal: {
      architecturalHighlights: string;
      keyAchievements: string;
      technologiesUsed: string;
      viewOnGithub: string;
      close: string;
    };
  };
  skills: {
    badge: string;
    heading: string;
    subtitle: string;
    categories: {
      ai: string;
      backend: string;
      data: string;
    };
  };
  contact: {
    badge: string;
    heading: string;
    description: string;
    email: string;
    phone: string;
    linkedin: string;
    copyright: string;
    backToOrbit: string;
  };
  askYogiri: {
    title: string;
    subtitle: string;
    onlineStatus: string;
    initialMessage: string;
    suggestedPromptsLabel: string;
    suggestedPrompts: string[];
    placeholder: string;
    sendButton: string;
    shortcutHint: string;
    disclaimer: string;
    resetTitle: string;
    closeTitle: string;
    thinkingText: string;
    errorPrefix: string;
  };
}

export const translations: Record<Language, TranslationData> = {
  id: {
    nav: {
      role: 'AI/ML Engineer',
      about: 'Tentang',
      projects: 'Proyek',
      skills: 'Keahlian',
      contact: 'Kontak',
      downloadCv: 'Unduh CV',
      hireMe: 'Rekrut Saya',
      askYogiri: 'Tanya Yogiri',
    },
    hero: {
      statusBadge: 'Tersedia untuk Posisi AI / ML & Agentic Systems',
      name: 'Fakhri Dinal Maulana Putra',
      taglineBefore: 'AI/ML Engineer dengan spesialisasi pada ',
      taglineHighlight1: 'Multi-Agent Systems (CrewAI)',
      taglineMiddle: ', ',
      taglineHighlight2: 'Enterprise RAG Pipelines',
      taglineAnd: ', dan ',
      taglineHighlight3: 'Deep Learning Computer Vision (PyTorch)',
      viewProjects: 'Lihat Proyek Portofolio',
      downloadCv: 'Unduh Resume',
      scrollToExplore: 'Gulir untuk eksplorasi proyek',
    },
    about: {
      badge: 'Tentang Saya',
      heading: 'Membangun Sistem AI Siap Produksi dengan Clean Architecture',
      bioP1: 'Saya adalah seorang ',
      bioP1Highlight1: 'AI/ML Engineer',
      bioP1Middle: ' lulusan ',
      bioP1Highlight2: 'Universitas Siliwangi (IPK 3.60 / 4.00)',
      bioP1End:
        ', berdedikasi dalam merekayasa perangkat lunak cerdas yang modular, teruji, dan siap produksi. Fokus inti saya mencakup perancangan alur kerja multi-agent otonom, mesin pencarian RAG tahan halusinasi, dan sistem visi komputer berakurasi tinggi.',
      location: 'Pangandaran, Indonesia',
      stat1Value: '3.60',
      stat1Label: 'IPK (Sarjana Informatika)',
      stat2Value: '3+',
      stat2Label: 'Proyek AI Unggulan',
      stat3Value: '100%',
      stat3Label: 'Clean Architecture',
    },
    projects: {
      badge: 'Proyek Rekayasa Unggulan',
      heading: 'Karya Teknis Terpilih',
      subtitle:
        'Sistem nyata yang dibangun dari nol, dilengkapi implementasi arsitektur perangkat lunak lengkap dan teruji.',
      modal: {
        architecturalHighlights: 'Sorotan Arsitektur',
        keyAchievements: 'Pencapaian Teknis Utama',
        technologiesUsed: 'Teknologi yang Digunakan',
        viewOnGithub: 'Lihat di GitHub',
        close: 'Tutup',
      },
      items: [
        {
          id: 'agent-orchestrator',
          title: 'Collaborative AI Agent Orchestrator',
          category: 'Multi-Agent Systems & GenAI',
          role: 'Lead Backend & Multi-Agent Systems Engineer',
          tagline:
            'Platform koordinasi multi-agent asinkron siap produksi dengan telemetri streaming real-time.',
          description:
            'Merancang sistem orkestrasi agentic tingkat enterprise memanfaatkan CrewAI, LangChain, dan FastAPI di bawah prinsip Clean Architecture. Mengoordinasikan agen otonom khusus dengan model lokal Ollama Llama-3/3.2 untuk pemecahan masalah kompleks.',
          tags: ['CrewAI', 'LangChain', 'FastAPI', 'Ollama (Llama 3.2)', 'Docker Compose', 'Streamlit'],
          features: [
            'Repositori tugas in-memory asinkron dengan ThreadPoolExecutor mengelola siklus hidup tugas (PENDING, RUNNING, COMPLETED, FAILED).',
            'Perekaman telemetri dan alur pemikiran agen (thought process) secara real-time streaming.',
            'Kustomisasi persona agen, pendelegasian tugas antar-agen, dan resolusi otomatis deadlock.',
            'Antarmuka interaktif Streamlit dengan rendering laporan markdown live dan fitur ekspor file.',
            'Penerapan multi-container yang menjembatani container backend dengan layanan host LLM.'
          ],
          architecture: [
            'Clean Architecture (Core, Services, API, Schemas)',
            'Asynchronous REST API dengan FastAPI & Pydantic v2',
            'Docker Compose Multi-Container Orchestration'
          ],
          metrics: '99.4% keandalan eksekusi alur kerja multi-agent',
          githubUrl: 'https://github.com/Yogiri19'
        },
        {
          id: 'rag-assistant',
          title: 'Enterprise Knowledge Assistant (RAG System)',
          category: 'Generative AI & Semantic Search',
          role: 'Project Lead & Core Developer',
          tagline:
            'Pipeline RAG lokal berkinerja tinggi dengan memori kontekstual dan pengindeksan dokumen multi-format.',
          description:
            'Membangun arsitektur Retrieval-Augmented Generation (RAG) end-to-end dengan ChromaDB dan HuggingFace sentence-transformers. Menghasilkan jawaban berakurasi tinggi dengan sitasi sumber tanpa kebocoran data keluar.',
          tags: ['FastAPI', 'ChromaDB', 'HuggingFace', 'Llama 3 via Ollama', 'Docker', 'Python'],
          features: [
            'Mesin pemrosesan dokumen multi-format yang mendukung file PDF, DOCX, TXT, dan Markdown.',
            'Pipeline chunking cerdas dengan overlap kontekstual dan pembuatan embedding vektor semantik.',
            'Pencarian kemiripan vektor dengan filter metadata dan pemangkasan batas relevansi.',
            'Memori percakapan multi-turn yang memetakan sitasi langsung ke paragraf dokumen asli.',
            'Rangkaian unit test backend otomatis untuk memastikan keandalan pipeline sepenuhnya.'
          ],
          architecture: [
            'Layered Clean Architecture (API, Service, Core, Database)',
            'Local Embeddings via sentence-transformers/all-MiniLM-L6-v2',
            'ChromaDB Vector Store dengan penyimpanan persisten'
          ],
          metrics: '< 450ms latensi pencarian semantik pada 10.000+ chunks',
          githubUrl: 'https://github.com/Yogiri19'
        },
        {
          id: 'vegetable-detection',
          title: 'Vegetable Object Detection & Classification',
          category: 'Computer Vision & Deep Learning',
          role: 'Core Deep Learning Engineer',
          tagline:
            'Jaringan saraf tiruan custom dual-head ResNet18 untuk klasifikasi dan regresi bounding box real-time.',
          description:
            'Mengembangkan model deep learning PyTorch khusus yang mampu mengklasifikasikan varietas sayuran sekaligus memprediksi koordinat spasial bounding box secara presisi dari rekaman kamera.',
          tags: ['PyTorch', 'ResNet-18', 'OpenCV', 'Streamlit', 'NumPy', 'Scikit-Learn'],
          features: [
            'Arsitektur neural network dual-head menggabungkan klasifikasi Cross-Entropy dan regresi koordinat MSELoss.',
            'Pipeline pengumpulan, anotasi, dan augmentasi dataset khusus menggunakan Raspberry Pi dan Pi Camera.',
            'Aplikasi inferensi interaktif Streamlit dengan overlay bounding box dinamis.',
            'Pipeline prapemrosesan dan normalisasi yang kokoh menggunakan NumPy dan Pandas.',
            'Evaluasi otomatis yang menghasilkan laporan metrik IoU (Intersection over Union) dan precision-recall.'
          ],
          architecture: [
            'PyTorch ResNet-18 Backbone dengan Kepala Regresi & Klasifikasi Khusus',
            'Pipeline inferensi real-time dengan penanganan stream OpenCV',
            'Augmentasi data melalui torchvision transforms'
          ],
          metrics: 'Lokalisasi presisi tinggi dengan inferensi real-time pada edge device',
          githubUrl: 'https://github.com/Yogiri19'
        }
      ]
    },
    skills: {
      badge: 'Keahlian & Teknologi',
      heading: 'Gudang Kemampuan Teknis',
      subtitle:
        'Toolkit komprehensif mulai dari algoritma pembelajaran mesin fundamental hingga sistem otonom generatif modern dan cloud deployment.',
      categories: {
        ai: 'AI / Machine Learning & GenAI',
        backend: 'Backend & Cloud Architecture',
        data: 'Data Science & Databases'
      }
    },
    contact: {
      badge: 'Mari Terhubung',
      heading: 'Mari Bangun Masa Depan Cerdas Bersama',
      description:
        'Apakah Anda memiliki proyek AI ambisius, inisiatif riset, maupun posisi rekayasa AI, saya sangat antusias untuk berkolaborasi.',
      email: 'godofwar085793692785@gmail.com',
      phone: '+62 857-9369-2785',
      linkedin: 'Profil LinkedIn',
      copyright: '© 2026 Fakhri Dinal Maulana Putra. Hak cipta dilindungi undang-undang.',
      backToOrbit: 'Kembali ke Orbit'
    },
    askYogiri: {
      title: 'Tanya Yogiri',
      subtitle: 'Didukung Gemini 3.6 • Tanya keahlian, proyek & profil',
      onlineStatus: 'AI Online',
      initialMessage: `Halo! Saya adalah **asisten AI resmi dari Fakhri Dinal (Yogiri)**.

Anda bisa bertanya seputar:
- **Keahlian & Tech Stack** (Multi-Agent Systems, RAG, PyTorch, FastAPI)
- **Proyek Rekayasa AI** (Collaborative Agent Orchestrator, RAG Enterprise, Computer Vision)
- **Latar Belakang & Pengalaman Kerja**
- **Cara Menghubungi / Merekrut Yogiri**

Apa yang ingin Anda ketahui tentang Yogiri?`,
      suggestedPromptsLabel: 'Pertanyaan yang sering diajukan:',
      suggestedPrompts: [
        '🎯 Apa keahlian utama Yogiri di bidang GenAI?',
        '🤖 Jelaskan proyek Collaborative AI Agent Orchestrator',
        '⚡ Bagaimana arsitektur RAG System yang pernah dibuat?',
        '📫 Bagaimana cara menghubungi atau merekrut Yogiri?'
      ],
      placeholder: 'Tanya keahlian, proyek, atau pengalaman Yogiri...',
      sendButton: 'Kirim',
      shortcutHint: 'Tekan Enter untuk mengirim • Esc untuk menutup',
      disclaimer: 'AI dapat membuat kekeliruan, verifikasi via proyek langsung',
      resetTitle: 'Reset Percakapan',
      closeTitle: 'Tutup (Esc)',
      thinkingText: 'Yogiri AI sedang berpikir...',
      errorPrefix: 'Maaf, terjadi gangguan saat menghubungi Gemini API:'
    }
  },

  en: {
    nav: {
      role: 'AI/ML Engineer',
      about: 'About',
      projects: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      downloadCv: 'Download CV',
      hireMe: 'Hire Me',
      askYogiri: 'Ask Yogiri',
    },
    hero: {
      statusBadge: 'Available for AI / ML & Agentic Systems Roles',
      name: 'Fakhri Dinal Maulana Putra',
      taglineBefore: 'AI/ML Engineer specializing in ',
      taglineHighlight1: 'Multi-Agent Systems (CrewAI)',
      taglineMiddle: ', ',
      taglineHighlight2: 'Enterprise RAG Pipelines',
      taglineAnd: ', and ',
      taglineHighlight3: 'Deep Learning Computer Vision (PyTorch)',
      viewProjects: 'View Portfolio Projects',
      downloadCv: 'Download Resume',
      scrollToExplore: 'Scroll to explore projects',
    },
    about: {
      badge: 'About Me',
      heading: 'Building Production-Grade AI Systems with Clean Architecture',
      bioP1: 'I am an ',
      bioP1Highlight1: 'AI/ML Engineer',
      bioP1Middle: ' graduated from ',
      bioP1Highlight2: 'Universitas Siliwangi (GPA 3.60 / 4.00)',
      bioP1End:
        ', dedicated to engineering modular, testable, and production-ready intelligent software. My core work revolves around constructing autonomous multi-agent workflows, hallucination-resistant RAG retrieval engines, and high-accuracy computer vision systems.',
      location: 'Pangandaran, Indonesia',
      stat1Value: '3.60',
      stat1Label: 'GPA (Bachelor of CS)',
      stat2Value: '3+',
      stat2Label: 'Core AI Projects',
      stat3Value: '100%',
      stat3Label: 'Clean Architecture',
    },
    projects: {
      badge: 'Featured Engineering Projects',
      heading: 'Selected Technical Works',
      subtitle:
        'Real-world systems built from ground up with complete software architecture implementations.',
      modal: {
        architecturalHighlights: 'Architectural Highlights',
        keyAchievements: 'Key Engineering Achievements',
        technologiesUsed: 'Technologies Used',
        viewOnGithub: 'View on GitHub',
        close: 'Close',
      },
      items: [
        {
          id: 'agent-orchestrator',
          title: 'Collaborative AI Agent Orchestrator',
          category: 'Multi-Agent Systems & GenAI',
          role: 'Lead Backend & Multi-Agent Systems Engineer',
          tagline:
            'Production-ready asynchronous multi-agent coordination platform with real-time streaming telemetry.',
          description:
            'Engineered an enterprise-grade agentic orchestration system leveraging CrewAI, LangChain, and FastAPI under Clean Architecture principles. Coordinates specialized autonomous agents with local Ollama Llama-3/3.2 models for complex problem-solving.',
          tags: ['CrewAI', 'LangChain', 'FastAPI', 'Ollama (Llama 3.2)', 'Docker Compose', 'Streamlit'],
          features: [
            'In-memory asynchronous task repository with background ThreadPoolExecutor managing task lifecycles (PENDING, RUNNING, COMPLETED, FAILED).',
            'Real-time streaming agent thought process & telemetry execution log capture.',
            'Custom agent personas, tool delegation, and automated deadlock resolution.',
            'Interactive Streamlit UI with live markdown report rendering and file export capabilities.',
            'Multi-container deployment bridging containerized backend calls with host-level LLM services.'
          ],
          architecture: [
            'Clean Architecture (Core, Services, API, Schemas)',
            'Asynchronous REST API with FastAPI & Pydantic v2',
            'Docker Compose Multi-Container Orchestration'
          ],
          metrics: '99.4% task execution reliability across multi-agent workflows',
          githubUrl: 'https://github.com/Yogiri19'
        },
        {
          id: 'rag-assistant',
          title: 'Enterprise Knowledge Assistant (RAG System)',
          category: 'Generative AI & Semantic Search',
          role: 'Project Lead & Core Developer',
          tagline:
            'High-performance local RAG pipeline with contextual memory and multi-format document indexing.',
          description:
            'Designed an end-to-end Retrieval-Augmented Generation architecture with ChromaDB and HuggingFace sentence-transformers. Delivers hallucination-resistant, cited answers from uploaded enterprise documents without external data leakage.',
          tags: ['FastAPI', 'ChromaDB', 'HuggingFace', 'Llama 3 via Ollama', 'Docker', 'Python'],
          features: [
            'Multi-format document ingestion engine supporting PDF, DOCX, TXT, and Markdown files.',
            'Intelligent chunking pipeline with contextual overlap and semantic vector embedding generation.',
            'Vector similarity search with metadata filtering and relevancy threshold pruning.',
            'Multi-turn conversational memory with citation mapping back to original source paragraphs.',
            'Comprehensive automated backend unit test suites ensuring bulletproof pipeline reliability.'
          ],
          architecture: [
            'Layered Clean Architecture (API, Service, Core, Database)',
            'Local Embeddings via sentence-transformers/all-MiniLM-L6-v2',
            'ChromaDB Vector Store with persistent storage'
          ],
          metrics: '< 450ms semantic retrieval latency on 10k+ chunk repositories',
          githubUrl: 'https://github.com/Yogiri19'
        },
        {
          id: 'vegetable-detection',
          title: 'Vegetable Object Detection & Classification',
          category: 'Computer Vision & Deep Learning',
          role: 'Core Deep Learning Engineer',
          tagline:
            'Custom dual-head ResNet18 neural network for real-time bounding box regression and classification.',
          description:
            'Developed a custom PyTorch deep learning model capable of simultaneously classifying vegetable varieties and accurately predicting bounding box spatial coordinates from camera feeds.',
          tags: ['PyTorch', 'ResNet-18', 'OpenCV', 'Streamlit', 'NumPy', 'Scikit-Learn'],
          features: [
            'Dual-head neural network architecture combining cross-entropy classification and MSELoss coordinate regression.',
            'Custom dataset collection, annotation, and augmentation pipeline built with Raspberry Pi and Pi Camera.',
            'Interactive Streamlit inference application with dynamic bounding box overlay rendering.',
            'Robust preprocessing and normalization pipeline using NumPy and Pandas.',
            'Automated evaluation routines generating IoU (Intersection over Union) and precision-recall reports.'
          ],
          architecture: [
            'PyTorch ResNet-18 Backbone with Custom Regression & Classification Heads',
            'Real-time inference pipeline with OpenCV stream handling',
            'Data augmentation via torchvision transforms'
          ],
          metrics: 'High precision localization with real-time inference on edge devices',
          githubUrl: 'https://github.com/Yogiri19'
        }
      ]
    },
    skills: {
      badge: 'Expertise & Stack',
      heading: 'Technical Arsenal',
      subtitle:
        'Comprehensive toolkit spanning foundational machine learning algorithms to modern generative multi-agent systems and cloud deployment.',
      categories: {
        ai: 'AI / Machine Learning & GenAI',
        backend: 'Backend & Cloud Architecture',
        data: 'Data Science & Databases'
      }
    },
    contact: {
      badge: "Let's Connect",
      heading: "Let's Build Intelligent Futures Together",
      description:
        'Whether you have an ambitious AI project, research initiative, or engineering role, I am excited to collaborate.',
      email: 'godofwar085793692785@gmail.com',
      phone: '+62 857-9369-2785',
      linkedin: 'LinkedIn Profile',
      copyright: '© 2026 Fakhri Dinal Maulana Putra. All rights reserved.',
      backToOrbit: 'Back to Orbit'
    },
    askYogiri: {
      title: 'Ask Yogiri',
      subtitle: 'Powered by Gemini 3.6 • Ask about skills, projects & background',
      onlineStatus: 'AI Online',
      initialMessage: `Hello! I am the **official AI assistant for Fakhri Dinal (Yogiri)**.

You can ask me about:
- **Technical Skills & Tech Stack** (Multi-Agent Systems, RAG, PyTorch, FastAPI)
- **Engineered AI Projects** (Collaborative Agent Orchestrator, Enterprise RAG, Computer Vision)
- **Background & Professional Experience**
- **How to Connect / Hire Yogiri**

What would you like to know about Yogiri?`,
      suggestedPromptsLabel: 'Frequently Asked Questions:',
      suggestedPrompts: [
        '🎯 What are Yogiri’s core GenAI skills?',
        '🤖 Explain the Collaborative AI Agent Orchestrator',
        '⚡ How is the Enterprise RAG system built?',
        '📫 How can I contact or hire Yogiri?'
      ],
      placeholder: "Ask anything about Yogiri's skills, projects, or background...",
      sendButton: 'Send',
      shortcutHint: 'Press Enter to send • Esc to close',
      disclaimer: 'AI can make mistakes, verify via project details',
      resetTitle: 'Reset Conversation',
      closeTitle: 'Close (Esc)',
      thinkingText: 'Yogiri AI is thinking...',
      errorPrefix: 'Sorry, an error occurred while reaching the Gemini API:'
    }
  }
};
