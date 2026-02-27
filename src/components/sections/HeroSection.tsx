const HeroSection = () => {
  return (
    <section id="home" className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-4">
            🌽 Cornflex
          </h1>
          <p className="font-display text-xl sm:text-2xl text-secondary font-semibold mb-6">
            Turning Corn Waste into Sustainable Solutions
          </p>
          <p className="font-body text-foreground/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Cornflex is an innovative environmental startup that transforms agricultural waste
            and fights pests like fall armyworm using eco-friendly products. We believe in building
            a sustainable future — one cornfield at a time.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <div className="text-4xl mb-4">🌱</div>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">Our Vision</h2>
            <p className="font-body text-foreground/70 leading-relaxed">
              A world where agricultural waste is no longer a burden but a resource — fueling innovation,
              protecting biodiversity, and empowering farming communities through circular economy solutions.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">Our Mission</h2>
            <p className="font-body text-foreground/70 leading-relaxed">
              To develop and deliver eco-friendly products derived from corn waste that protect crops,
              reduce pollution, and create value from what was once discarded — making sustainability
              accessible and profitable for farmers everywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
