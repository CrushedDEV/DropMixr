import { UploadCloud, Music, Users, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: UploadCloud,
      title: 'Sube tu Mashup',
      desc: 'Comparte tu mezcla original y desbloquea acceso a la biblioteca exclusiva.',
      color: 'from-pink-500 to-rose-500',
      number: '01'
    },
    {
      icon: Music,
      title: 'Descubre Nuevas Mezclas',
      desc: 'Accede a mashups únicos de otros creadores para inspirar tus sets.',
      color: 'from-purple-500 to-indigo-500',
      number: '02'
    },
    {
      icon: Users,
      title: 'Conecta con DJs',
      desc: 'Forma parte de una comunidad exclusiva de productores apasionados.',
      color: 'from-blue-500 to-cyan-500',
      number: '03'
    }
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Cómo Funciona</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tres pasos para <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">empezar</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Solo podrás acceder a los mashups si subes el tuyo. Comparte tus mezclas y descubre inspiraciones únicas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all hover:-translate-y-2"
            >
              {/* Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-xl font-bold text-gray-500 group-hover:text-white transition-colors">
                {step.number}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>

              {/* Arrow */}
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-700" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
