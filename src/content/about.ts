import parkPhoto from '../assets/about/park.webp'
import workPhoto from '../assets/about/work.webp'
import tccPhoto from '../assets/about/tcc.webp'
import graduationPhoto from '../assets/about/graduation.webp'
import beachPhoto from '../assets/about/beach.webp'
import catPhoto from '../assets/about/cat.webp'
import coffeeBeachPhoto from '../assets/about/coffee-beach.webp'
import type { Localized } from '../i18n/types'

export interface AboutPhoto {
  /**
   * Imported image URL (files in src/assets/about). While it is missing,
   * a tinted placeholder card is shown in its place.
   */
  src?: string
  alt: Localized
  /** Small speech-bubble caption above the photo. */
  tag?: { label: Localized; tone: 'yellow' | 'neutral' }
}

export const about = {
  /** One entry per line on tablet/desktop; *italic* is allowed. */
  headline: {
    pt: ['Engenheira de software', 'construindo soluções *eficientes*', 'para milhares de usuários.'],
    en: ['A software engineer', 'building *efficient* solutions', 'for thousands of users.'],
  },
  lead: {
    pt: 'Mais de 3 anos de experiência do front-end ao back-end, hoje dedicada ao mercado financeiro.',
    en: 'Over 3 years of experience from front end to back end, now focused on the financial market.',
  },
  /**
   * Photo fan under the headline: up to 7 photos, laid out from left to right
   * (the 4th sits on top, in the middle). Files live in src/assets/about,
   * cropped to the card shape (456×576) without camera metadata.
   */
  photos: [
    {
      src: parkPhoto,
      alt: {
        pt: 'Parque com chafariz e um arco-íris na água, sob céu azul',
        en: 'Park with a fountain and a rainbow in the spray, under a blue sky',
      },
    },
    {
      src: workPhoto,
      alt: {
        pt: 'Mesa de trabalho na Nelogica, com notebook, lata de energético e o adesivo "Programando para dominar o mundo"',
        en: 'Desk at Nelogica with a laptop, an energy drink and a "Programando para dominar o mundo" sticker',
      },
      tag: { label: { pt: 'Nelogica', en: 'Nelogica' }, tone: 'yellow' },
    },
    {
      src: tccPhoto,
      alt: {
        pt: 'Andressa ao lado do slide de apresentação do seu TCC na Unipampa',
        en: 'Andressa next to the title slide of her undergraduate thesis at Unipampa',
      },
    },
    {
      src: graduationPhoto,
      alt: {
        pt: 'Andressa de beca, segurando o canudo da formatura em Ciência da Computação',
        en: 'Andressa in a graduation gown, holding her Computer Science diploma',
      },
    },
    {
      src: beachPhoto,
      alt: {
        pt: 'Guarda-sóis coloridos em uma praia cheia, sob céu azul',
        en: 'Colorful umbrellas on a busy beach, under a blue sky',
      },
    },
    {
      src: catPhoto,
      alt: {
        pt: 'Gato preto sentado na janela ao sol, ao lado de um vaso de planta',
        en: 'Black cat sitting on a sunny windowsill next to a potted plant',
      },
    },
    {
      src: coffeeBeachPhoto,
      alt: {
        pt: 'Café na areia da praia, com garrafa térmica, caneca e frutas, sob o céu alaranjado',
        en: 'Coffee on the sand with a thermos, a mug and fruit, under an orange sky',
      },
      tag: { label: { pt: 'Café na praia', en: 'Coffee at the beach' }, tone: 'neutral' },
    },
  ] as AboutPhoto[],
  /** Opening paragraphs, before the labelled sections. */
  intro: [
    {
      pt: 'Moro em Porto Alegre e me especializo em criar experiências digitais *bem construídas*. Formada em Ciência da Computação e mestranda em Engenharia de Software, atuo principalmente em **plataformas de trading**.',
      en: "Based in Porto Alegre, I specialize in creating *well-crafted* digital experiences. With a degree in Computer Science and a master's in Software Engineering underway, I mainly work on **trading platforms**.",
    },
    {
      pt: 'Gosto de transformar problemas complexos em *soluções simples*. Para isso, me interessa entender **o que fica por baixo da interface**: como o dado chega, onde fica guardado e quanto custa renderizar tudo de novo.',
      en: "I like turning complex problems into *simple solutions*. To get there, I care about **what sits beneath the interface**: how the data arrives, where it is stored and how much it costs to render everything again.",
    },
  ] satisfies Localized[],
  sections: [
    {
      id: 'now',
      label: { pt: 'No trabalho atual', en: 'In my current role' },
      body: {
        pt: [
          'Na **Nelogica**, desenvolvo aplicações web e uno meu gosto por boas práticas de desenvolvimento, por experiências de qualidade e por ajudar pessoas a crescer.',
          'Trabalhar em aplicações **críticas e em tempo real** para a bolsa de valores me ensinou a importância de um **código claro e conciso** e de ter *redes de proteção* para quando algo dá errado, em vez de tentar prever todos os bugs com antecedência.',
          'A complexidade dessas aplicações exigiu que eu aprendesse e me adaptasse rápido, usando as tecnologias e APIs mais recentes da web. Também precisei dominar **otimização de performance** e uma série de **padrões de projeto**.',
        ],
        en: [
          "At **Nelogica**, I build web applications and bring together my love for good software practices, quality experiences and helping people grow.",
          'Working on a collection of **high-stakes, real-time applications** for the stock market has taught me the importance of **clear and concise code**, and of having *safety nets* for when things go wrong, instead of trying to predict every bug ahead of time.',
          "The complexity of these applications has required me to learn and adapt fast, using the web's most cutting-edge technologies and APIs. I also had to master **performance optimization** and a wide range of **design patterns**.",
        ],
      },
    },
    {
      id: 'research',
      label: { pt: 'Na pesquisa', en: 'In research' },
      body: {
        pt: [
          'No mestrado em Engenharia de Software da **Unipampa**, faço parte do grupo de pesquisa do programa e estudo **inteligência artificial aplicada a contextos educacionais**. Minha dissertação é um **tutor inteligente de metodologia científica**, pensado para apoiar o processo de ensino-aprendizagem.',
          'A pesquisa faz um recorte do método científico: das quatro fases do processo (decisão, construção, análise e exposição), foca na *decisão*, quando o pesquisador define o tema e avalia se a pesquisa é viável. Em vez de entregar respostas prontas, o tutor conduz esse processo com perguntas.',
        ],
        en: [
          "In my master's in Software Engineering at **Unipampa**, I'm part of the program's research group and study **artificial intelligence applied to educational contexts**. My dissertation is an **intelligent tutor for scientific methodology**, designed to support teaching and learning.",
          "The research narrows the scientific method down: of the process's four phases (decision, construction, analysis and presentation), it focuses on *decision*, when researchers define their topic and assess whether the research is feasible. Instead of handing out ready-made answers, the tutor guides this process with questions.",
        ],
      },
    },
    {
      id: 'path',
      label: { pt: 'Trajetória', en: 'Background' },
      body: {
        pt: [
          'Minha paixão por engenharia de software começou em 2018, quando entrei no bacharelado em **Ciência da Computação**. Desde então, redescubro todos os dias o gosto por programar, pensar arquiteturas e criar produtos *realmente úteis* para as pessoas.',
          'Nesse caminho, passei de uma desenvolvedora júnior cheia de vontade de aprender a uma **engenheira de software experiente**, com um histórico sólido de entregas de qualidade, de **aplicações B2B em escala corporativa** a experiências web de ponta para o usuário final.',
        ],
        en: [
          "My passion for software engineering started back in 2018, when I began my bachelor's in **Computer Science**. Every day since, I've rediscovered my love for coding, architecture and creating products that are *actually useful* to people.",
          "Along the way, I've grown from a hopeful junior developer into an **experienced software engineer** with a solid track record of delivering high-quality software, from **enterprise-scale B2B applications** to state-of-the-art web experiences for end users.",
        ],
      },
    },
  ] satisfies { id: string; label: Localized; body: Localized<string | string[]> }[],
  cta: { pt: 'Vamos trabalhar juntos?', en: "Let's work together." },
}
