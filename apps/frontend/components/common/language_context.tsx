'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, any>> = {
    pt: {
        // Hero - flat structure first
        'hero.subtitle': 'Aumente suas chances de entrevista com um currículo perfeitamente personalizado.',
        'hero.getStarted': 'Começar',
        
        // Hero - nested structure
        hero: {
            subtitle: 'Aumente suas chances de entrevista com um currículo perfeitamente personalizado.',
            getStarted: 'Começar',
        },
        
        // Dashboard
        'dashboard.title': 'Seu Dashboard Resume Matcher',
        'dashboard.subtitle': 'Gerencie seu currículo e analise sua compatibilidade com vagas.',
        'dashboard.jobAnalyzer': 'Analisador de Vagas',
        'dashboard.uploadJob': 'Enviar Descrição da Vaga',
        'dashboard.noJobAnalyzed': 'Nenhuma descrição de vaga analisada ainda.',
        'dashboard.resumeAnalysis': 'Análise do Currículo',
        'dashboard.yourResume': 'Seu Currículo',
        'dashboard.updateResume': 'Atualize via página de upload de currículo.',
        'dashboard.downloadPDF': 'Baixar PDF',
        'dashboard.downloadingPDF': 'Gerando PDF...',
        'dashboard.pdfError': 'Erro ao gerar PDF. Tente novamente.',
        
        // Resume Analysis
        'analysis.title': 'Análise do Currículo',
        'analysis.viewFull': 'Ver Análise Completa',
        'analysis.detailedTitle': 'Análise Detalhada do Currículo',
        'analysis.overallScore': 'Pontuação Geral',
        'analysis.summary': 'Resumo',
        'analysis.details': 'Detalhes',
        'analysis.commentary': 'Comentário',
        'analysis.improvements': 'Sugestões de Melhoria',
        'analysis.close': 'Fechar',
        'analysis.original': 'Original',
        'analysis.optimized': 'Otimizado',
        'analysis.noSuggestions': 'Nenhuma sugestão específica de melhoria no momento.',
        
        // Compatibility Analysis
        'compatibility.detailed': '📊 **Análise de Compatibilidade Detalhada**',
        'compatibility.incompatible': '⚠️ **Incompatibilidade Detectada:** Áreas profissionais muito diferentes',
        'compatibility.limited': '📋 **Compatibilidade Limitada:** Gaps significativos identificados',
        'compatibility.scoring': '🎯 **Pontuação:**',
        'compatibility.original': 'Score original',
        'compatibility.validated': 'Score validado',
        'compatibility.adjustment': 'Ajuste de compatibilidade',
        'compatibility.status': 'Status',
        'compatibility.keywords': '🔍 **Análise de Palavras-chave:**',
        'compatibility.jobKeywords': 'Palavras-chave da vaga',
        'compatibility.resumeKeywords': 'Palavras-chave no currículo',
        'compatibility.coverage': 'Taxa de cobertura',
        'compatibility.methodology': '🤖 **Metodologia:**',
        'compatibility.methodologyText': 'O sistema utiliza embeddings de IA (OpenAI) combinados com validação de compatibilidade profissional para calcular scores realistas. A análise considera similaridade semântica, mas aplica penalizações para incompatibilidades de domínio.',
        
        // Comments
        'comment.incompatible': '⚠️ Incompatibilidade detectada entre áreas profissionais. Score ajustado para {score}% (era {original}%).',
        'comment.limited': 'Compatibilidade limitada detectada. Score ajustado para {score}%.',
        'comment.excellent': 'Excelente compatibilidade! Seu currículo está muito bem alinhado com os requisitos da vaga.',
        'comment.good': 'Boa compatibilidade. Seu currículo demonstra qualificações relevantes para a posição.',
        'comment.moderate': 'Compatibilidade moderada. Há algumas áreas que podem ser melhoradas para maior alinhamento.',
        'comment.low': 'Baixa compatibilidade. Considere destacar mais experiências relevantes para esta vaga.',
        
        // Suggestions
        'suggestion.incompatible.1': '⚠️ Áreas profissionais muito diferentes detectadas',
        'suggestion.incompatible.2': '🎯 Considere vagas mais alinhadas com sua experiência',
        'suggestion.incompatible.3': '📚 Se deseja mudar de área, considere cursos de transição',
        'suggestion.incompatible.4': '🔄 Identifique e destaque skills transferíveis',
        'suggestion.low.1': '📈 Há potencial mas com gaps significativos',
        'suggestion.low.2': '🎓 Considere desenvolver competências específicas da área',
        'suggestion.low.3': '💡 Destaque experiências relevantes mesmo que indiretas',
        'suggestion.moderate.1': '🔗 Destaque skills transferíveis e experiências relacionadas',
        'suggestion.moderate.2': '💡 Enfatize competências universais aplicáveis',
        'suggestion.moderate.3': '📊 Quantifique resultados que demonstrem capacidade',
        'suggestion.high.1': '✅ Boa compatibilidade profissional detectada',
        'suggestion.high.2': '🎯 Continue destacando suas principais competências',
        'suggestion.high.3': '📊 Quantifique resultados e impacto específicos',
        
        // Language Selector
        'language.select': 'Selecione seu idioma',
        'language.pt': 'Português',
        'language.en': 'English',
        'language.es': 'Español',
    },
    en: {
        // Hero - flat structure first
        'hero.subtitle': 'Increase your interview chances with a perfectly tailored resume.',
        'hero.getStarted': 'Get Started',
        
        // Hero - nested structure
        hero: {
            subtitle: 'Increase your interview chances with a perfectly tailored resume.',
            getStarted: 'Get Started',
        },
        
        // Dashboard
        'dashboard.title': 'Your Resume Matcher Dashboard',
        'dashboard.subtitle': 'Manage your resume and analyze its match with job descriptions.',
        'dashboard.jobAnalyzer': 'Job Analyzer',
        'dashboard.uploadJob': 'Upload Job Description',
        'dashboard.noJobAnalyzed': 'No job description analyzed yet.',
        'dashboard.resumeAnalysis': 'Resume Analysis',
        'dashboard.yourResume': 'Your Resume',
        'dashboard.updateResume': 'Update it via the resume upload page.',
        'dashboard.downloadPDF': 'Download PDF',
        'dashboard.downloadingPDF': 'Generating PDF...',
        'dashboard.pdfError': 'Error generating PDF. Please try again.',
        
        // Resume Analysis
        'analysis.title': 'Resume Analysis',
        'analysis.viewFull': 'View Full Analysis',
        'analysis.detailedTitle': 'Detailed Resume Analysis',
        'analysis.overallScore': 'Overall Score',
        'analysis.summary': 'Summary',
        'analysis.details': 'Details',
        'analysis.commentary': 'Commentary',
        'analysis.improvements': 'Improvement Suggestions',
        'analysis.close': 'Close',
        'analysis.original': 'Original',
        'analysis.optimized': 'Optimized',
        'analysis.noSuggestions': 'No specific improvement suggestions at this time.',
        
        // Compatibility Analysis
        'compatibility.detailed': '📊 **Detailed Compatibility Analysis**',
        'compatibility.incompatible': '⚠️ **Incompatibility Detected:** Very different professional areas',
        'compatibility.limited': '📋 **Limited Compatibility:** Significant gaps identified',
        'compatibility.scoring': '🎯 **Scoring:**',
        'compatibility.original': 'Original score',
        'compatibility.validated': 'Validated score',
        'compatibility.adjustment': 'Compatibility adjustment',
        'compatibility.status': 'Status',
        'compatibility.keywords': '🔍 **Keyword Analysis:**',
        'compatibility.jobKeywords': 'Job keywords',
        'compatibility.resumeKeywords': 'Resume keywords',
        'compatibility.coverage': 'Coverage rate',
        'compatibility.methodology': '🤖 **Methodology:**',
        'compatibility.methodologyText': 'The system uses AI embeddings (OpenAI) combined with professional compatibility validation to calculate realistic scores. The analysis considers semantic similarity but applies penalties for domain incompatibilities.',
        
        // Comments
        'comment.incompatible': '⚠️ Incompatibility detected between professional areas. Score adjusted to {score}% (was {original}%).',
        'comment.limited': 'Limited compatibility detected. Score adjusted to {score}%.',
        'comment.excellent': 'Excellent compatibility! Your resume is very well aligned with the job requirements.',
        'comment.good': 'Good compatibility. Your resume demonstrates relevant qualifications for the position.',
        'comment.moderate': 'Moderate compatibility. There are some areas that can be improved for better alignment.',
        'comment.low': 'Low compatibility. Consider highlighting more relevant experiences for this job.',
        
        // Suggestions
        'suggestion.incompatible.1': '⚠️ Very different professional areas detected',
        'suggestion.incompatible.2': '🎯 Consider jobs more aligned with your experience',
        'suggestion.incompatible.3': '📚 If you want to change areas, consider transition courses',
        'suggestion.incompatible.4': '🔄 Identify and highlight transferable skills',
        'suggestion.low.1': '📈 There is potential but with significant gaps',
        'suggestion.low.2': '🎓 Consider developing area-specific competencies',
        'suggestion.low.3': '💡 Highlight relevant experiences even if indirect',
        'suggestion.moderate.1': '🔗 Highlight transferable skills and related experiences',
        'suggestion.moderate.2': '💡 Emphasize applicable universal competencies',
        'suggestion.moderate.3': '📊 Quantify results that demonstrate capability',
        'suggestion.high.1': '✅ Good professional compatibility detected',
        'suggestion.high.2': '🎯 Continue highlighting your main competencies',
        'suggestion.high.3': '📊 Quantify specific results and impact',
        
        // Language Selector
        'language.select': 'Select your language',
        'language.pt': 'Português',
        'language.en': 'English',
        'language.es': 'Español',
    },
    es: {
        // Hero - flat structure first
        'hero.subtitle': 'Aumenta tus posibilidades de entrevista con un currículum perfectamente personalizado.',
        'hero.getStarted': 'Comenzar',
        
        // Hero - nested structure
        hero: {
            subtitle: 'Aumenta tus posibilidades de entrevista con un currículum perfectamente personalizado.',
            getStarted: 'Comenzar',
        },
        
        // Dashboard
        'dashboard.title': 'Tu Dashboard Resume Matcher',
        'dashboard.subtitle': 'Gestiona tu currículum y analiza su compatibilidad con ofertas de trabajo.',
        'dashboard.jobAnalyzer': 'Analizador de Ofertas',
        'dashboard.uploadJob': 'Subir Descripción de Trabajo',
        'dashboard.noJobAnalyzed': 'Ninguna descripción de trabajo analizada aún.',
        'dashboard.resumeAnalysis': 'Análisis del Currículum',
        'dashboard.yourResume': 'Tu Currículum',
        'dashboard.updateResume': 'Actualízalo a través de la página de subida de currículum.',
        'dashboard.downloadPDF': 'Descargar PDF',
        'dashboard.downloadingPDF': 'Generando PDF...',
        'dashboard.pdfError': 'Error al generar PDF. Inténtalo de nuevo.',
        
        // Resume Analysis
        'analysis.title': 'Análisis del Currículum',
        'analysis.viewFull': 'Ver Análisis Completo',
        'analysis.detailedTitle': 'Análisis Detallado del Currículum',
        'analysis.overallScore': 'Puntuación General',
        'analysis.summary': 'Resumen',
        'analysis.details': 'Detalles',
        'analysis.commentary': 'Comentario',
        'analysis.improvements': 'Sugerencias de Mejora',
        'analysis.close': 'Cerrar',
        'analysis.original': 'Original',
        'analysis.optimized': 'Optimizado',
        'analysis.noSuggestions': 'No hay sugerencias específicas de mejora en este momento.',
        
        // Compatibility Analysis
        'compatibility.detailed': '📊 **Análisis de Compatibilidad Detallado**',
        'compatibility.incompatible': '⚠️ **Incompatibilidad Detectada:** Áreas profesionales muy diferentes',
        'compatibility.limited': '📋 **Compatibilidad Limitada:** Brechas significativas identificadas',
        'compatibility.scoring': '🎯 **Puntuación:**',
        'compatibility.original': 'Puntuación original',
        'compatibility.validated': 'Puntuación validada',
        'compatibility.adjustment': 'Ajuste de compatibilidad',
        'compatibility.status': 'Estado',
        'compatibility.keywords': '🔍 **Análisis de Palabras Clave:**',
        'compatibility.jobKeywords': 'Palabras clave del trabajo',
        'compatibility.resumeKeywords': 'Palabras clave del currículum',
        'compatibility.coverage': 'Tasa de cobertura',
        'compatibility.methodology': '🤖 **Metodología:**',
        'compatibility.methodologyText': 'El sistema utiliza embeddings de IA (OpenAI) combinados con validación de compatibilidad profesional para calcular puntuaciones realistas. El análisis considera similitud semántica pero aplica penalizaciones por incompatibilidades de dominio.',
        
        // Comments
        'comment.incompatible': '⚠️ Incompatibilidad detectada entre áreas profesionales. Puntuación ajustada a {score}% (era {original}%).',
        'comment.limited': 'Compatibilidad limitada detectada. Puntuación ajustada a {score}%.',
        'comment.excellent': '¡Excelente compatibilidad! Tu currículum está muy bien alineado con los requisitos del trabajo.',
        'comment.good': 'Buena compatibilidad. Tu currículum demuestra calificaciones relevantes para la posición.',
        'comment.moderate': 'Compatibilidad moderada. Hay algunas áreas que pueden mejorarse para mejor alineación.',
        'comment.low': 'Baja compatibilidad. Considera destacar más experiencias relevantes para este trabajo.',
        
        // Suggestions
        'suggestion.incompatible.1': '⚠️ Áreas profesionales muy diferentes detectadas',
        'suggestion.incompatible.2': '🎯 Considera trabajos más alineados con tu experiencia',
        'suggestion.incompatible.3': '📚 Si quieres cambiar de área, considera cursos de transición',
        'suggestion.incompatible.4': '🔄 Identifica y destaca habilidades transferibles',
        'suggestion.low.1': '📈 Hay potencial pero con brechas significativas',
        'suggestion.low.2': '🎓 Considera desarrollar competencias específicas del área',
        'suggestion.low.3': '💡 Destaca experiencias relevantes aunque sean indirectas',
        'suggestion.moderate.1': '🔗 Destaca habilidades transferibles y experiencias relacionadas',
        'suggestion.moderate.2': '💡 Enfatiza competencias universales aplicables',
        'suggestion.moderate.3': '📊 Cuantifica resultados que demuestren capacidad',
        'suggestion.high.1': '✅ Buena compatibilidad profesional detectada',
        'suggestion.high.2': '🎯 Continúa destacando tus principales competencias',
        'suggestion.high.3': '📊 Cuantifica resultados e impacto específicos',
        
        // Language Selector
        'language.select': 'Selecciona tu idioma',
        'language.pt': 'Português',
        'language.en': 'English',
        'language.es': 'Español',
    }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en'); // Default to English
    const [isLoaded, setIsLoaded] = useState(false);

    // Load language from localStorage on client side
    React.useEffect(() => {
        const savedLanguage = localStorage.getItem('resumeMatcher_language') as Language;
        if (savedLanguage && ['en', 'pt', 'es'].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
        setIsLoaded(true);
    }, []);

    // Save language to localStorage when it changes
    const handleLanguageChange = (newLanguage: Language) => {
        setLanguage(newLanguage);
        localStorage.setItem('resumeMatcher_language', newLanguage);
    };

    const t = (key: string): string => {
        const translation = translations[language];
        
        // Simple lookup by key
        if (translation && translation[key]) {
            return translation[key];
        }
        
        // Try nested lookup for dot notation
        const keys = key.split('.');
        let value: any = translation;
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key; // Return key if translation not found
    };

    // Show loading or default while loading saved language
    if (!isLoaded) {
        return (
            <LanguageContext.Provider value={{ language: 'en', setLanguage: handleLanguageChange, t }}>
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}