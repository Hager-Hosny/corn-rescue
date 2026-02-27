const TEAM_MEMBERS = [
  {
    name: "Ahmed Benali",
    role: "Founder & CEO",
    bio: "Passionate about sustainable agriculture and circular economy. Leading Cornflex's vision to transform waste into value.",
    emoji: "👨‍💼",
  },
  {
    name: "Sara Mansour",
    role: "Head of R&D",
    bio: "Biochemist specializing in biopolymers and natural pest control solutions derived from agricultural residues.",
    emoji: "👩‍🔬",
  },
  {
    name: "Youssef Karim",
    role: "Product Designer",
    bio: "Industrial designer focused on creating sustainable furniture and acoustic panels from corn waste fibers.",
    emoji: "👨‍🎨",
  },
  {
    name: "Nadia Chaker",
    role: "Operations Manager",
    bio: "Expert in supply chain management, ensuring eco-friendly production and distribution of all Cornflex products.",
    emoji: "👩‍💻",
  },
];

const TeamSection = () => {
  return (
    <section id="team" className="py-16 px-4 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-bold text-primary mb-3">Our Team</h2>
          <p className="font-body text-foreground/70 max-w-xl mx-auto">
            Meet the people behind Cornflex — driven by passion for sustainability and innovation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">{member.emoji}</span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">{member.name}</h3>
              <p className="font-body text-sm text-secondary font-semibold mb-3">{member.role}</p>
              <p className="font-body text-sm text-foreground/60 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
