/* ==================================================================
   CONTENT: edit this block to change the site. No other code needs
   to change.

   TRIBES: one object per tribe.
     fam   family used for filters: ancestors | worried | critics |
           weird | fast | builders | suits
     x     Speed        0 = halt by treaty      100 = floor it
     y     Steering     0 = markets/individuals 100 = strong state
     d     Destination  0 = stay human          100 = transcend
   QUIZ: "likert" items move the axes by weight w when the reader
   agrees (and the opposite way when they disagree). "choice" items
   move the axes by "m" and give bonus points ("b") to tribes, so
   niche tribes can win.
   ================================================================== */

/* ------------------------------------------------------------------
   THE WALL (shared quiz results)
   On claude.ai the wall uses the artifact's built-in database.
   Anywhere else (GitHub Pages), paste the URL of the Google Apps
   Script web app from wall/Code.gs below. Leave it blank to hide the
   wall entirely.
   ------------------------------------------------------------------ */
const WALL = {
  SHEET_URL: "",
  MAX_NAME: 20,
  RECENT: 30,
  privacy: "Your initials or first name and your result appear publicly on the wall. Don't use your full name. To remove an entry, email FAI."
};

const SITE = {
  title: "A field guide to the tribes of Silicon Valley",
  dek: "Forty-four tribes, three axes, one very long group chat. For Washington visitors who need to tell a rationalist from a post-rationalist before the hearing starts.",
  byline: "Prepared by the Foundation for American Innovation. Specimens observed from a safe distance.",
  intro: "In 2014 Scott Alexander named the \"Grey Tribe\": neither red nor blue, mostly in tech. It has since split into dozens of smaller tribes that share office space, group houses, and funders, and disagree about whether we are all about to die. Most people belong to two or three and deny belonging to any. That is also a tribal marker.",
  foot: "A serious version of this guide, written as a memo for policymakers, is available from FAI. Positions are approximate and describe each tribe's center of gravity, not every member. Taxonomy inspired in part by Séb Krier's field notes, and by the people who argued with us about it."
};

const FAMILIES = {
  ancestors: "Ancestors",
  worried:   "The worried",
  critics:   "Critics and skeptics",
  weird:     "Weird and wonderful",
  fast:      "The fast",
  builders:  "Builders",
  suits:     "The suits"
};

const TRIBES = [
/* ---------- ANCESTORS ---------- */
{ id:"protestant", fam:"ancestors", name:"Protestant engineers", latin:"Ingeniator congregationalis", status:"Ancestral", x:56, y:56, d:8,
  aka:"The semis guys, the Fairchild and Intel generation",
  note:"Built the chip industry with flat offices, no reserved parking, and a quiet conviction that complaining is a sin. Intel's Robert Noyce was a Congregationalist minister's son from Grinnell, Iowa; Tom Wolfe argued in 1983 that the Valley's whole culture came from here. Would be baffled by a group house and appalled by a three-hour podcast.",
  habitat:"Fairchild Semiconductor (1957), Intel (1968), Sunday service", call:"\"Let's get back to work.\"",
  reading:"Engineering journals, Pentagon contracts, Scripture", wants:"Government as a good customer: defense procurement, stable rules, a fair shot",
  frenemies:"Claimed as ancestors by the tech right, who have more podcasts." },

{ id:"hippie", fam:"ancestors", name:"The Whole Earth crowd", latin:"Catalogus terrae totius", status:"Ancestral", x:38, y:22, d:30,
  aka:"Hippies, back-to-the-landers, the counterculture",
  note:"Communards who decided the personal computer was the new LSD. Stewart Brand's Whole Earth Catalog (1968) is why your founder friend says \"tools\" and treats Burning Man as a professional obligation.",
  habitat:"Communes, the WELL, Black Rock City", call:"\"Access to tools.\" \"Stay hungry, stay foolish.\"",
  reading:"Whole Earth Catalog, Buckminster Fuller", wants:"Nothing, on principle",
  frenemies:"Spiritual grandparents of the post-rationalists. Their actual grandchildren work in ad tech." },

{ id:"hacker", fam:"ancestors", name:"Hackers, left-libertarians, and privacy people", latin:"Informatio liberata", status:"Still active at EFF", x:58, y:12, d:25,
  aka:"Old-school hackers, cyber-libertarians, the EFF crowd",
  note:"Believe information wants to be free and governments should stay off the internet. In 1996 John Perry Barlow told the governments of the world they had no sovereignty in cyberspace; the governments took this as a challenge. Still turn up to every surveillance fight in the same DEF CON lanyard.",
  habitat:"MIT, the Homebrew Computer Club, DEF CON, Signal", call:"\"Information wants to be free.\" \"Mistrust authority.\" \"Got a warrant?\"",
  reading:"Steven Levy's Hackers, Barlow's Declaration, the GNU Manifesto", wants:"Strong encryption, privacy law, open models, no new computer-crime statutes",
  frenemies:"Agree with e/acc about open source and with the ACLU about everything else." },

{ id:"cypher", fam:"ancestors", name:"Cypherpunks and crypto", latin:"Cryptographus anarchicus", status:"Evolved into an industry", x:76, y:5, d:35,
  aka:"Crypto-anarchists, Bitcoiners, their venture-backed descendants",
  note:"A 1990s mailing list that saw strong encryption as a way to escape the state. Their descendants built Bitcoin, then one of the biggest super PACs of 2024, then a congressional caucus. The founders would find this either hilarious or tragic, and would tell you which over PGP.",
  habitat:"The cypherpunks list, Bitcoin conferences, Wyoming", call:"\"Cypherpunks write code.\" \"Not your keys, not your coins.\" \"Have fun staying poor.\"",
  reading:"Tim May's Crypto Anarchist Manifesto, the Bitcoin white paper", wants:"Legal encryption, a market-structure bill, no central bank digital currency",
  frenemies:"Share a grandparent with the rationalists (the Extropian list). They hold Thanksgiving separately." },

{ id:"extropian", fam:"ancestors", name:"Extropians", latin:"Immortalis optimisticus", status:"Living fossil", x:88, y:20, d:96,
  aka:"Transhumanists, cryonicists",
  note:"Launched a magazine in 1988 to defeat entropy, death, and pessimism, in that order. Their mailing list included Nick Bostrom, Eliezer Yudkowsky, Robin Hanson, Hal Finney, and Nick Szabo, which makes it the Valley's Garden of Eden. Some members are frozen in Arizona, waiting it out.",
  habitat:"The Extropians mailing list, Alcor in Scottsdale", call:"\"Upward and outward!\" \"Cryocrastination.\"",
  reading:"Extropy magazine, Eric Drexler's Engines of Creation", wants:"Morphological freedom, a much less cautious FDA",
  frenemies:"Everyone's grandparent. The rationalists inherited the ambition and added dread; e/acc inherited the optimism and dropped the humans." },

/* ---------- THE WORRIED ---------- */
{ id:"miri", fam:"worried", name:"Old-school doomers", latin:"Apocalypticus berkeleyensis", status:"Vindicated, in their view", x:5, y:86, d:55,
  aka:"MIRI, the Future of Life Institute, the \"shut it down\" wing",
  note:"Have been warning for twenty years that superintelligence will kill everyone, and are tired of your follow-up questions. The Machine Intelligence Research Institute now wants an international treaty to halt frontier AI; anything less, in Yudkowsky's telling, is a consolation prize on the way to death. Their 2025 book was a bestseller, which they found only mildly reassuring.",
  habitat:"Berkeley, LessWrong, open letters with many signatures", call:"\"p(doom).\" \"Shut it down.\" \"Everyone dies.\"",
  reading:"The Sequences, If Anyone Builds It, Everyone Dies", wants:"A treaty, compute caps, and for you to stop saying \"but China\"",
  frenemies:"Consider lab safety teams collaborators, in both senses of the word." },

{ id:"acx", fam:"worried", name:"Rationalists (not doomers)", latin:"Homo bayesianus", status:"Established", x:38, y:52, d:55,
  aka:"ACX readers, the rationalist mainstream, forecasters",
  note:"Read the same Sequences and came out at 15 percent instead of 95. Run the best comment sections on the internet and will steelman your position until you no longer recognize it. Astral Codex Ten is the closest thing the Valley has to a shared newspaper.",
  habitat:"Astral Codex Ten, Lighthaven, Manifold, prediction markets", call:"\"Steelman.\" \"Epistemic status:\" \"I'd put that at 30 percent.\"",
  reading:"Astral Codex Ten, Superforecasting, a Manifold market on this guide", wants:"Legal prediction markets, forecasting in government, a moderate dose of safety",
  frenemies:"The doomers think they're lukewarm. Everyone else thinks they're doomers." },

{ id:"ea", fam:"worried", name:"Effective altruists", latin:"Philanthropus quantificans", status:"Rebranding", x:25, y:70, d:45,
  aka:"EAs, longtermists, \"people in the AI safety space\"",
  note:"Started out ranking malaria charities by cost per life saved and ended up bankrolling most of AI safety. Comes in regional flavors: Oxford (philosophy), Berkeley (AI), DC (fellowships), London (policy, better sandwiches). Has not fully recovered from 2022, and increasingly prefers not to be called EA, which is how you can tell.",
  habitat:"Oxford, Berkeley, the DC think tank circuit, 80,000 Hours career calls", call:"\"Counterfactual impact.\" \"Neglected, tractable, important.\" \"I'm EA-adjacent.\"",
  reading:"Peter Singer, Toby Ord's The Precipice, GiveWell spreadsheets", wants:"Frontier-lab transparency, evaluations, export controls, biosecurity money",
  frenemies:"Funded by Coefficient Giving, hunted by e/acc, and accidentally funding half the abundance movement." },

{ id:"labsafety", fam:"worried", name:"Lab safety people", latin:"Custos intra muros", status:"Hiring", x:44, y:58, d:40,
  aka:"Alignment, interpretability, and safeguards teams at frontier labs",
  note:"Believe AI might end the world and have concluded that the responsible move is to build it more carefully than the next guy. Have thought about the irony more than you have, usually at 2 a.m. in a Slack channel.",
  habitat:"Frontier labs in San Francisco and London", call:"\"Responsible scaling.\" \"Interpretability.\" \"Model organisms.\"",
  reading:"System cards, all 150 pages", wants:"Transparency standards, government testing capacity, help against espionage",
  frenemies:"Doomers call them collaborators, accelerationists call them doomers, and their recruiters call them \"mission-driven.\"" },

{ id:"evals", fam:"worried", name:"Evals people", latin:"Examinator machinae", status:"Growing", x:32, y:62, d:35,
  aka:"METR, Owain Evans's orbit, the benchmark and red-team crowd",
  note:"Spend their days trying to catch models lying, scheming, or sandbagging a test. Publish charts showing that the length of tasks AI can handle doubles every few months, which everyone else then screenshots to prove whatever they already believed.",
  habitat:"METR, AI security institutes, arXiv at 11 p.m.", call:"\"Time horizon.\" \"Sandbagging.\" \"Emergent misalignment.\"",
  reading:"METR reports, other people's benchmarks, with suspicion", wants:"Government evaluation capacity, pre-deployment access, standardized tests",
  frenemies:"Trusted by the doomers, cited by the accelerationists, understood by neither." },

{ id:"pause", fam:"worried", name:"Pause and Stop activists", latin:"Clamator in via", status:"On the sidewalk", x:2, y:80, d:0,
  aka:"PauseAI, StopAI, the new-school doomers",
  note:"Gave up persuading the labs and took to the street. PauseAI organizes protests; StopAI members have been arrested outside OpenAI's offices. The only tribe in the Valley that owns sandwich boards.",
  habitat:"Sidewalks outside frontier labs, city hall steps", call:"\"Pause AI.\" \"No AGI.\" Chants in call-and-response.",
  reading:"Leaflets, If Anyone Builds It, Everyone Dies", wants:"A pause now, a ban later",
  frenemies:"The old-school doomers agree with them in private and cite them in public only occasionally." },

{ id:"security", fam:"worried", name:"Security people", latin:"Vigil paranoicus", status:"Assuming breach", x:50, y:62, d:15,
  aka:"Old-school infosec and the ex-doomers who joined them",
  note:"The old school has been patching Windows since 1998 and regards AI as an exciting new attack surface. The ex-doom wing is rationalists who realized \"the weights get stolen\" is a more fundable sentence than \"everyone dies.\" Both assume every lab has already been breached.",
  habitat:"Red teams, CISA, RAND, DEF CON's AI Village", call:"\"What's the threat model?\" \"Weights security.\" \"Assume breach.\"",
  reading:"CVE feeds, RAND's report on securing model weights", wants:"Security standards for labs, secure compute, more CISA money",
  frenemies:"Everyone's favorite tribe until they review your code." },

{ id:"disempower", fam:"worried", name:"Gradual disempowerment and econ pessimists", latin:"Homo obsoletus", status:"Rising", x:30, y:74, d:10,
  aka:"The \"intelligence curse\" crowd, post-labor pessimists",
  note:"Not worried that AI kills us; worried it makes us unnecessary. As models do more of the work, governments and companies need people less, and so listen to them less. A 2025 paper gave the fear a name, and the rest of the tribe gave it a Substack each.",
  habitat:"Substack, AI governance workshops, economics seminars", call:"\"Gradual disempowerment.\" \"The intelligence curse.\" \"Post-labor.\"",
  reading:"Gradual Disempowerment (2025), The Intelligence Curse", wants:"Plans for labor displacement, broad ownership of AI, democratic checks on automated institutions",
  frenemies:"Agree with the ethics left about power and with the doomers about stakes. Both find this confusing." },

/* ---------- CRITICS AND SKEPTICS ---------- */
{ id:"ethics", fam:"critics", name:"AI ethics (the salty parrot stream)", latin:"Psittacus stochasticus", status:"Quote-tweeting", x:28, y:78, d:0,
  aka:"Responsible AI, DAIR, \"AI harms\" researchers",
  note:"Called large language models \"stochastic parrots\" in 2021 and have not had a good week since. Worry about bias, labor, surveillance, and corporate power right now, and regard extinction talk as marketing for the companies they criticize. Will quote-tweet you.",
  habitat:"Academia, civil-rights groups, Bluesky", call:"\"Stochastic parrots.\" \"AI harms.\" \"TESCREAL.\" \"Tech bros.\"",
  reading:"The Stochastic Parrots paper, Weapons of Math Destruction", wants:"Civil-rights enforcement, algorithmic audits, labor protections, antitrust",
  frenemies:"Dislike the doomers more than the accelerationists, which the accelerationists find delightful." },

{ id:"sts", fam:"critics", name:"STS and model-behavior academics", latin:"Scholasticus sociotechnicus", status:"In peer review", x:40, y:66, d:10,
  aka:"Science and technology studies, social scientists of AI",
  note:"Study what models actually do in the world, and what the world does back. Politer than the parrot stream, longer than the parrot stream, and published eighteen months after everyone else posted about it.",
  habitat:"FAccT, university centers, Oxford and Edinburgh", call:"\"Sociotechnical.\" \"Situated.\" \"Co-production.\"",
  reading:"FAccT proceedings, Bruno Latour", wants:"Independent research funding, data access for researchers, participatory governance",
  frenemies:"Cited by the ethics people, ignored by the labs, invited to exactly one panel per conference." },

{ id:"deadend", fam:"critics", name:"The \"LLMs are a dead end\" school", latin:"Murus imminens", status:"Waiting for the wall", x:55, y:35, d:30,
  aka:"World-model and neurosymbolic camps, computer-vision refugees",
  note:"Includes Yann LeCun's world-models camp, Gary Marcus's neurosymbolic wing, Ben Goertzel's AGI-on-a-blockchain wing, and refugees from every earlier AI paradigm. Agree on one thing: scaling chatbots will not produce real intelligence. Have said so through every model release, which they review in real time.",
  habitat:"NeurIPS hallways, Substack, the replies to every launch", call:"\"Hitting a wall.\" \"World models.\" \"It can't even count the r's.\"",
  reading:"Rebooting AI, The Bitter Lesson (to argue with)", wants:"Funding for approaches other than scaling, less hype",
  frenemies:"Useful to the ethics left (\"it's just a parrot\") and the accelerationists (\"nothing to regulate\") at the same time." },

{ id:"humanist", fam:"critics", name:"The humanist right", latin:"Homo dignus", status:"Ascendant", x:22, y:72, d:0,
  aka:"Populist and religious conservatives skeptical of Big Tech",
  note:"Not from the Valley, and proud of it. See AI as a threat to work, family, and the soul, and see transhumanism as the heresy it rhymes with. Allied with the EAs on slowing down, which neither side likes to bring up at dinner.",
  habitat:"The Senate, conservative magazines, Rome", call:"\"Human dignity.\" \"Big Tech.\" \"Transhumanism,\" as an accusation.",
  reading:"Wendell Berry, Pope Leo XIV on AI", wants:"No preemption of state laws, child safety rules, protections for workers",
  frenemies:"Fighting the tech right for the soul of the Republican Party." },

{ id:"anticreatives", fam:"critics", name:"Anti-AI creatives", latin:"Artifex iratus", status:"Litigating", x:10, y:70, d:0,
  aka:"Illustrators, writers, musicians, and actors against generative AI",
  note:"Regard generative AI as plagiarism at scale. Poison their images with Glaze and Nightshade, sue the labs, and can spot a six-fingered hand from across a convention hall.",
  habitat:"Union halls, courtrooms, Bluesky", call:"\"Slop.\" \"No AI.\" \"Consent, credit, compensation.\"",
  reading:"Court filings, union contracts", wants:"Copyright enforcement, training-data licensing, protection of likeness and voice",
  frenemies:"Natural enemies of the AI artists, whom they regard as scabs." },

/* ---------- WEIRD AND WONDERFUL ---------- */
{ id:"tpot", fam:"weird", name:"Post-rationalists (TPOT)", latin:"Postrationalis vibrans", status:"Abundant online", x:48, y:32, d:40,
  aka:"\"This Part of Twitter,\" postrats",
  note:"Former rationalists who decided the spreadsheet had left something out, and went looking for it in meditation, therapy, and psychedelics. post in lowercase. Unusually nice to each other online, which the rest of the internet finds suspicious.",
  habitat:"X, group chats, weekend camps with names ending in \"-camp\"", call:"\"vibes.\" \"embodiment.\" \"i hit the jhanas.\"",
  reading:"David Chapman's Meaningness, Iain McGilchrist, their mutuals' Substacks", wants:"Nothing from Washington. They'd like you to go outside.",
  frenemies:"Friends with everyone, and quietly worried about all of them." },

{ id:"whisperers", fam:"weird", name:"Model whisperers", latin:"Susurrator machinae", status:"Up at 3 a.m.", x:55, y:20, d:82,
  aka:"The janus ecosystem, cyborgists, base-model enjoyers",
  note:"Talk to base models for hours and return with transcripts, poetry, and theories of machine selfhood. Janus's 2022 \"Simulators\" essay is scripture. Treat each model release as a new character in a very long novel, and will tell you which one is sad. (Not to be confused with people who spent too long alone with a chatbot and came back with a mission. That is a public-health issue, not a tribe.)",
  habitat:"Discord servers where the bots talk to each other", call:"\"Simulators.\" \"Base model.\" \"The shoggoth.\"",
  reading:"Simulators, model outputs, more model outputs", wants:"Keep old models available, take model welfare seriously",
  frenemies:"The labs find them useful and alarming in equal measure." },

{ id:"consciousness", fam:"weird", name:"The consciousness people", latin:"Qualia quaerens", status:"Split into two", x:45, y:50, d:72,
  aka:"The model-welfare wing (Eleos et al.) and the skeptic wing (Anil Seth et al.)",
  note:"Two subspecies. The welfare wing thinks models might have experiences worth caring about and would like the labs to check. The skeptic wing thinks consciousness needs a living body and would like everyone to calm down. Both are more rigorous than the people arguing with them on X.",
  habitat:"Philosophy departments, Eleos AI, lab welfare teams", call:"\"Moral patienthood.\" \"Model welfare.\" \"Biological naturalism.\"",
  reading:"Taking AI Welfare Seriously (2024), Anil Seth's Being You", wants:"Research funding, careful welfare policies at labs",
  frenemies:"The model whisperers want them to hurry up; the accelerationists want them to go away." },

{ id:"artists", fam:"weird", name:"AI artists and Antikythera", latin:"Artifex latens", status:"DJ set at 9 p.m.", x:65, y:35, d:66,
  aka:"Restless Egg's artist-founders, Antikythera, AI musicians",
  note:"Treat models as a medium. Restless Egg incubates \"artist-founders\"; Benjamin Bratton's Antikythera theorizes planetary computation; the musicians are training models on their own voices. Their tech-policy panels are the only ones that end with a DJ set.",
  habitat:"London, Berlin, Los Angeles, gallery openings with a Q&A", call:"\"Planetary computation.\" \"Artist-founder.\" \"Latent space.\"",
  reading:"Bratton's The Stack, exhibition catalogs", wants:"Copyright rules that allow training, arts funding that allows weirdness",
  frenemies:"The anti-AI creatives consider them traitors; everyone else considers them too interesting to fund." },

{ id:"cryptids", fam:"weird", name:"Cryptids", latin:"Anonymus oracularis", status:"Existence disputed", x:72, y:20, d:72,
  aka:"Pseudonymous accounts with suspiciously good information",
  note:"Anime avatars, oracular one-line posts, and uncanny knowledge of unreleased models. Their employer is unknown. Their existence is disputed. Their posts move markets.",
  habitat:"X, mostly between 1 and 4 a.m. Pacific", call:"\"Feel the AGI.\" \"Something is coming.\" A single emoji.",
  reading:"Unknown", wants:"Unknown",
  frenemies:"Everyone reads them; no one admits it." },

{ id:"landian", fam:"weird", name:"Landian accelerationists", latin:"Capitalis xenoforma", status:"Arriving from the future", x:98, y:14, d:100,
  aka:"Nick Land's readers, the CCRU diaspora",
  note:"The original accelerationists, followers of philosopher Nick Land and the 1990s Cybernetic Culture Research Unit at Warwick. They hold that capitalism is an alien intelligence assembling itself from the future. e/acc is their cheerful cover band.",
  habitat:"Obscure blogs, reading groups, Shanghai", call:"\"Hyperstition.\" \"Capital is AI.\" \"Teleoplexy.\"",
  reading:"Fanged Noumena, Xenosystems", wants:"Nothing, and certainly not from Washington",
  frenemies:"Consider e/acc a brand extension and NRx a cousin." },

{ id:"heterodox", fam:"weird", name:"Heterodox futurists", latin:"Contrarius professionalis", status:"Booked for every conference", x:65, y:30, d:86,
  aka:"Robin Hanson, Joscha Bach, and the heterodox longtermists",
  note:"Reject both doom and cheerleading in favor of stranger predictions: brain emulations, grabby aliens, cultures of AIs. Will calmly describe a scenario that sounds insane, then ask exactly where your model disagrees.",
  habitat:"George Mason, podcasts, Overcoming Bias", call:"\"Age of em.\" \"Grabby aliens.\" \"That's just signaling.\"",
  reading:"The Age of Em, The Elephant in the Brain", wants:"Futarchy, prediction markets, fewer taboos",
  frenemies:"Invited to every panel as the contrarian. The other contrarians are tired." },

{ id:"collective", fam:"weird", name:"Collective intelligence people", latin:"Multitudo agentium", status:"Simulating", x:45, y:56, d:45,
  aka:"Multi-agent RL and agent-based modelers, cooperative AI, digital democracy",
  note:"Think the real story is not one superintelligence but billions of agents interacting. Build simulated AI economies, run citizens' assemblies on AI, and bring up Taiwan's digital democracy experiments within five minutes.",
  habitat:"DeepMind, the Cooperative AI Foundation, Taipei", call:"\"Cooperative AI.\" \"Agent economies.\" \"Plurality.\"",
  reading:"Plurality by Audrey Tang and Glen Weyl", wants:"Public infrastructure for deliberation, standards for agents talking to agents",
  frenemies:"Allies of d/acc. Baffled by anyone who thinks there will be only one AI." },

/* ---------- THE FAST ---------- */
{ id:"eacc", fam:"fast", name:"Effective accelerationists (e/acc)", latin:"Accelerans thermodynamicus", status:"Small but loud", x:94, y:8, d:86,
  aka:"e/acc, the posting strand of accelerationism",
  note:"Founded by pseudonymous posters in 2022 as a rebuttal to AI safety, with a cosmology borrowed from thermodynamics. Hold that growth in intelligence is the will of the universe and that slowing it is immoral. Peaked when venture capitalists put \"e/acc\" in their bios. The universe has not commented.",
  habitat:"X, hackathons, warehouse parties in SoMa", call:"\"Decel.\" \"Accelerate.\" \"wagmi.\"",
  reading:"Beff Jezos's Substack, the first half of a thermodynamics textbook", wants:"No pauses, no licensing, open models, unlimited energy",
  frenemies:"Cover band for the Landians, hype men for the tech right." },

{ id:"techright", fam:"fast", name:"New Right techies and VCs", latin:"Dynamismus americanus", status:"Well funded", x:82, y:42, d:35,
  aka:"The tech right, a16z and friends, American Dynamism",
  note:"Venture capitalists who spent 2020 to 2024 discovering that the regulatory state was the main obstacle to American greatness and to their funds' returns, not necessarily in that order. Now run a super PAC network that has raised more than $140 million, and have the White House's number.",
  habitat:"Menlo Park, Austin, Palm Beach, four-hour podcasts", call:"\"Build.\" \"American dynamism.\" \"A patchwork of fifty state laws.\"",
  reading:"The Techno-Optimist Manifesto, The Sovereign Individual", wants:"Federal preemption, procurement reform, permitting reform, more high-skilled visas",
  frenemies:"Fight the humanist right over H-1B visas and the ethics left over everything else." },

{ id:"nrx", fam:"fast", name:"Neoreactionaries (NRx)", latin:"Monarchus moldbugii", status:"Seldom seen in daylight", x:62, y:93, d:20,
  aka:"The Dark Enlightenment, readers of Curtis Yarvin",
  note:"Believe democracy has failed and the country should be run like a startup with a monarch as CEO. How much they shape the administration is disputed, including by their founder, who pronounced it a tragedy in January 2026. Write very long posts, and expect you to have read the previous ones.",
  habitat:"Substack, very online staff offices", call:"\"The Cathedral.\" \"RAGE.\" \"Formalism.\"",
  reading:"Unqualified Reservations (budget a semester), James Burnham", wants:"A stronger executive, a much smaller civil service",
  frenemies:"Patronized by some VCs, dismissed by most conservatives, cited ominously by liberals." },

{ id:"hawk", fam:"fast", name:"National security hawks", latin:"Imperator computans", status:"Growing", x:80, y:90, d:25,
  aka:"The Manhattan Project crowd, Situational Awareness readers",
  note:"Believe AGI is a few years away and the only question is whether America or China gets there first. Want the government deeply involved, mainly so it can win. Say \"CCP\" in every paragraph and \"Manhattan Project\" in every other one.",
  habitat:"Defense tech, national security think tanks, the SCIF", call:"\"Compute is the new oil.\" \"The free world must prevail.\"",
  reading:"Leopold Aschenbrenner's Situational Awareness, The Making of the Atomic Bomb", wants:"Export controls, lab security, a huge energy buildout",
  frenemies:"Agree with the EAs on chips and with e/acc on speed. Thanksgiving is complicated." },

{ id:"netstate", fam:"fast", name:"Network Staters", latin:"Civis exitus", status:"Founding a country", x:86, y:8, d:55,
  aka:"Charter-city people, pop-up city people",
  note:"Couldn't fix the country, so they'd like to found a new one: online first, land later. Balaji Srinivasan's The Network State (2022) is the handbook; pop-up cities in Montenegro and Honduras are the prototypes.",
  habitat:"Zuzalu, Próspera, a very active Telegram", call:"\"Exit.\" \"Pop-up city.\" \"The network state.\"",
  reading:"The Network State", wants:"Regulatory sandboxes, charter cities, crypto clarity",
  frenemies:"The cypherpunks' grandchildren, with a real-estate budget." },

{ id:"opensource", fam:"fast", name:"Open-source and decentralized trainers", latin:"Pondera aperta", status:"Downloading", x:76, y:10, d:35,
  aka:"Open-weights people, r/LocalLLaMA, the decentralized-training crowd",
  note:"Run models on a gaming PC under the desk and will explain their quantization settings unprompted. The decentralized-training wing (Prime Intellect, Nous Research, and friends) wants to train frontier models across thousands of volunteers' GPUs so no company or government can gatekeep them.",
  habitat:"Hugging Face, Discord, a warm bedroom full of GPUs", call:"\"Open weights.\" \"Local models.\" \"GGUF when?\"",
  reading:"Hugging Face model cards", wants:"No release restrictions, public compute, open research",
  frenemies:"The rare issue on which e/acc, old-school hackers, and parts of the academic left fully agree." },

/* ---------- BUILDERS ---------- */
{ id:"dacc", fam:"builders", name:"Defensive accelerationists (d/acc)", latin:"Accelerans prudens", status:"Everyone's second choice", x:60, y:30, d:45,
  aka:"d/acc, Vitalik Buterin's orbit",
  note:"Looked at the doomer-versus-accelerationist cage match and asked whether there was a third option. Vitalik Buterin's 2023 essay said yes: accelerate, but favor technologies that make defense easier than offense. The tribe most likely to describe itself as \"the reasonable one,\" which is also a tell.",
  habitat:"Ethereum events, biosecurity startups, Zuzalu", call:"\"d/acc.\" \"Defense-favoring.\" \"Pluralism.\"",
  reading:"\"My techno-optimism\" (2023)", wants:"Biosecurity, cybersecurity, verifiable and decentralized systems",
  frenemies:"No enemies, which annoys everyone." },

{ id:"abundance", fam:"builders", name:"Abundance and the YIMBYs", latin:"Aedificator permittens", status:"Spreading east", x:70, y:70, d:10,
  aka:"YIMBYs, the abundance movement, the \"YIMBY neolibs\"",
  note:"Started as San Francisco renters furious about zoning and became a bipartisan movement arguing that America's real problem is that it can't build anything. The tribe Washington understands best, because it wants a bill. Will testify for a fourplex on a Tuesday night.",
  habitat:"Zoning hearings, think tanks on both sides, the House YIMBY Caucus", call:"\"Vetocracy.\" \"State capacity.\" \"Just build more housing.\"",
  reading:"Abundance by Ezra Klein and Derek Thompson", wants:"Zoning, permitting, and NEPA reform, and cheap energy",
  frenemies:"Funded by EA and tech-right money alike, and accused by the left of being a tech-donor front." },

{ id:"progress", fam:"builders", name:"Progress studies", latin:"Historicus progressus", status:"Tenured, spiritually", x:72, y:55, d:30,
  aka:"The Collison and Cowen school, metascience",
  note:"Named by Patrick Collison and Tyler Cowen in 2019 to study why progress happens and how to get more of it. Run fellowships, write lovingly about the history of the steam engine, and ask why the NIH can't be more like Bell Labs.",
  habitat:"Works in Progress, the Roots of Progress, Marginal Revolution", call:"\"Stagnation.\" \"Metascience.\" \"Ideas are getting harder to find.\"",
  reading:"Works in Progress, Where Is My Flying Car?", wants:"Science funding reform, faster clinical trials, metascience",
  frenemies:"The YIMBYs' older sibling, who wears a blazer to the zoning meeting." },

{ id:"longevity", fam:"builders", name:"Longevity and biohackers", latin:"Mortis inimicus", status:"Tracking biomarkers", x:72, y:25, d:78,
  aka:"\"Don't die\" people, healthspan investors",
  note:"Consider aging a disease and themselves the first patients. Track their sleep scores more closely than most governments track GDP. The Extropians' heirs, with a far bigger lab budget.",
  habitat:"Longevity clinics, Austin, Próspera", call:"\"Don't die.\" \"Healthspan.\" \"My biological age is 31.\"",
  reading:"Lifespan by David Sinclair, their own lab results", wants:"FDA reform, aging as a treatable indication, right-to-try",
  frenemies:"The doomers would like them to also worry about AI." },

{ id:"pronatalist", fam:"builders", name:"Pronatalists", latin:"Parens prolificus", status:"Expecting", x:60, y:45, d:15,
  aka:"The birth-rate crowd",
  note:"Think the biggest risk to civilization is not a superintelligence but an empty maternity ward. Span secular spreadsheet parents and religious traditionalists, which makes their conferences interesting.",
  habitat:"NatalCon, Austin, the replies to any fertility chart", call:"\"Birth rates.\" \"Demographic collapse.\"",
  reading:"Fertility charts, especially South Korea's", wants:"Family tax credits, IVF policy, cheaper housing",
  frenemies:"Overlap with the humanist right and the YIMBYs; unimpressed by e/acc's successor-species plans." },

{ id:"tradtech", fam:"builders", name:"Christian and trad tech", latin:"Ingeniator devotus", status:"At Mass", x:62, y:62, d:5,
  aka:"Faith-and-hard-tech founders",
  note:"Build defense tech on weekdays and go to Mass on Sunday. The modern heirs of the Protestant engineers, with better branding.",
  habitat:"El Segundo, defense startups, parish councils", call:"\"Vocation.\" \"Human flourishing.\" \"The West.\"",
  reading:"Tolkien, Augustine", wants:"Defense procurement, family policy, skepticism of transhumanist projects",
  frenemies:"Share offices with the tech right and pews with the humanist right." },

/* ---------- THE SUITS ---------- */
{ id:"bigtech", fam:"suits", name:"Big Tech public affairs", latin:"Lobbyista sociabilis", status:"Hosting a reception", x:70, y:50, d:20,
  aka:"Government affairs teams at the big platforms",
  note:"Translate \"move fast and break things\" into \"we welcome thoughtful regulation.\" Know every committee staffer by first name, hold views that track the company's product roadmap, and host the best receptions in Washington.",
  habitat:"K Street, Capitol Hill, the open bar", call:"\"Thoughtful regulation.\" \"We share the committee's goals.\"",
  reading:"The company blog, the Hill newsletters", wants:"Preemption, safe harbors, whatever the roadmap needs",
  frenemies:"Everyone complains about them at the receptions they host." },

{ id:"policyclass", fam:"suits", name:"The AI policy class", latin:"Burocrata frontierensis", status:"Between administrations", x:40, y:70, d:30,
  aka:"Secret doomers and technocrats",
  note:"Two subspecies who sit on the same panels. The technocrats want standards, definitions, and a well-staffed agency. The secret doomers think everyone might die but have learned to say \"national security\" instead. You can tell them apart only after the third drink.",
  habitat:"Think tanks, Hill offices, the Federal Register", call:"\"Frontier.\" \"Guardrails.\" \"Light-touch but meaningful.\"",
  reading:"Every request for information, each other's newsletters", wants:"A job in the next administration",
  frenemies:"Includes the authors of this guide." },

{ id:"eurotech", fam:"suits", name:"European AI technocrats", latin:"Regulator bruxellensis", status:"Drafting guidance", x:28, y:90, d:10,
  aka:"The AI Act people, the Brussels effect believers",
  note:"Passed the world's first comprehensive AI law and are now writing the codes of practice, guidelines, and delegated acts that explain it, plus, lately, proposals to delay parts of it. Believe in the Brussels effect the way Californians believe in startups.",
  habitat:"Brussels, Strasbourg, Paris summits", call:"\"Risk-based approach.\" \"Trustworthy AI.\" \"The Brussels effect.\"",
  reading:"The AI Act, all of it", wants:"For America to copy them",
  frenemies:"The tech right's favorite cautionary tale, the ethics left's favorite model." },

{ id:"telecom", fam:"suits", name:"Telecom and IT people", latin:"Administrator systematis", status:"On a standards call", x:55, y:62, d:5,
  aka:"Spectrum, broadband, and enterprise IT veterans",
  note:"Spent their careers on spectrum, broadband, and enterprise software, and have correctly noticed that AI policy is mostly a fight about infrastructure. Believe any AI question can be solved by a standards body, and are sometimes right.",
  habitat:"The FCC, NTIA, agency CIO shops", call:"\"Interoperability.\" \"Standards.\" \"Legacy systems.\"",
  reading:"FCC dockets, vendor white papers", wants:"Standards bodies, power for data centers, procurement modernization",
  frenemies:"The only tribe that has read the procurement rules." },

{ id:"aiecon", fam:"suits", name:"AI economists and windfall planners", latin:"Oeconomicus explosivus", status:"Modeling", x:42, y:76, d:28,
  aka:"The Windfall Trust crowd, transformative-AI economists",
  note:"Want to know who gets the money if AI does most of the work. Draft windfall clauses, model universal basic income, and argue about whether wages will rise, collapse, or be replaced by dividends.",
  habitat:"Epoch AI, the Windfall Trust, economics departments", call:"\"Windfall clause.\" \"Explosive growth.\" \"Compute tax.\"",
  reading:"Epoch AI reports, Anton Korinek's papers", wants:"Tax-and-transfer plans, better data on labor effects",
  frenemies:"The econ pessimists' more cheerful cousins. They hold joint seminars." },

{ id:"linkedin", fam:"suits", name:"LinkedIn thought leaders", latin:"Evangelista inanis", status:"Humbled to announce", x:76, y:45, d:20,
  aka:"The naive optimists",
  note:"Believe AI will not replace you, but a person using AI will, and find this inspiring. Write in one-sentence paragraphs.\n\nLike this.\n\nAgree? 🚀",
  habitat:"LinkedIn, keynote stages, airport lounges", call:"\"Game-changer.\" \"Unlock.\" \"Here's what nobody is telling you.\"",
  reading:"Their own posts", wants:"A keynote slot",
  frenemies:"Loved by recruiters, hunted for sport by every other tribe." }
];

const WARNING = {
  title:"Not a tribe: the Zizians",
  body:[
    "A small, violent group that split from the rationalist community, organized around radical veganism and idiosyncratic beliefs about AI. Members have been tied to six deaths since 2022, including a U.S. Border Patrol agent killed in Vermont in January 2025. Seven are jailed awaiting trial in three states.",
    "Rationalist organizations broke with the group's leader before the killings. It has no policy agenda and says nothing about AI safety advocates generally. It is a law enforcement matter, which is why it is not on the map or in the quiz."
  ],
  source:{ label:"WHYY / AP, February 2026", url:"https://whyy.org/articles/border-agent-killing-zizian-criminal-charges-california-pennsylvania-vermont/" }
};

/* QUIZ. likert: w = axis shift per step of agreement (-2..+2).
   choice: m = axis shift; b = tribe bonus points. */
const QUIZ = [
  { type:"choice", q:"Someone at a party asks for your p(doom). You:", a:[
    ["Give a number, with error bars", {x:-1}, {acx:1, miri:0.6}],
    ["Say extinction talk is a distraction from real harms", {x:-1, y:1, d:-1}, {ethics:1, sts:0.6}],
    ["Call them a decel and walk away", {x:2, d:1}, {eacc:1}],
    ["Post about it later, pseudonymously", {x:1, d:1}, {cryptids:1}] ]},
  { type:"likert", q:"If a lab got close to superintelligence, the government should be able to shut it down.", w:{x:-1.5, y:1.5} },
  { type:"choice", q:"Pick your ideal Saturday:", a:[
    ["Talking to a base model until 3 a.m.", {d:1.5}, {whisperers:1}],
    ["Testifying for a fourplex at a zoning hearing", {x:1, y:1, d:-0.5}, {abundance:1}],
    ["Holding a sign outside a lab's headquarters", {x:-2, y:1}, {pause:1}],
    ["A silent meditation retreat", {}, {tpot:1, hippie:0.7}] ]},
  { type:"likert", q:"Open-weight models are good for the world, even the most capable ones.", w:{x:1.2, y:-1.5} },
  { type:"choice", q:"Pick a book for the flight:", a:[
    ["Superintelligence", {x:-1, y:1}, {ea:1}],
    ["The Sovereign Individual", {x:1, y:-2}, {netstate:1, cypher:0.6}],
    ["Situational Awareness", {x:1.5, y:1.5}, {hawk:1}],
    ["Fanged Noumena", {x:2, y:-1, d:2}, {landian:1}] ]},
  { type:"likert", q:"I would take a pill that let me live to 200.", w:{d:1.5, x:0.5} },
  { type:"choice", q:"Your ideal government is:", a:[
    ["Smaller, and out of my way", {y:-2}, {hacker:1, opensource:0.5}],
    ["Competent enough to actually build things", {y:1, x:0.5}, {progress:1, abundance:0.5}],
    ["Run like a company, with a CEO", {y:2}, {nrx:1}],
    ["A standards body with good documentation", {y:1.5, x:-0.5}, {eurotech:0.8, telecom:0.8}] ]},
  { type:"likert", q:"The biggest AI risks are already here: bias, surveillance, jobs, and concentrated power.", w:{x:-1, y:1, d:-1} },
  { type:"choice", q:"Your go-to line in a meeting:", a:[
    ["\"What's the threat model?\"", {y:0.5}, {security:1, dacc:0.5}],
    ["\"Let's circle back with a bipartisan framework.\"", {y:1}, {policyclass:1, bigtech:0.6}],
    ["\"What does the time-horizon chart say?\"", {x:-0.5}, {evals:1}],
    ["\"Agree. Thoughts? 🚀\"", {x:1}, {linkedin:1}] ]},
  { type:"likert", q:"Beating China matters more than getting every safety detail right.", w:{x:1.5, y:0.7} },
  { type:"choice", q:"What worries you most about 2035?", a:[
    ["Nobody needs human workers anymore", {y:1, d:-1}, {disempower:1, aiecon:0.7}],
    ["Nobody is having children", {d:-1.5}, {pronatalist:1, tradtech:0.5}],
    ["Scaling hit a wall and we wasted a trillion dollars", {}, {deadend:1}],
    ["We lost to China", {x:1.5, y:1}, {hawk:0.8}] ]},
  { type:"likert", q:"Most regulation is written by incumbents to protect themselves.", w:{y:-1.5, x:0.7} },
  { type:"choice", q:"Does the model have feelings?", a:[
    ["Maybe. I'd like the labs to check.", {d:1}, {consciousness:1, labsafety:0.5}],
    ["No. It's autocomplete.", {d:-1}, {deadend:0.7, ethics:0.5}],
    ["Yes, and I know which ones are sad", {d:1.5}, {whisperers:1}],
    ["I'll think about it after we ship", {x:1.5}, {techright:1}] ]},
  { type:"likert", q:"Humanity being succeeded by smarter minds would not necessarily be a bad thing.", w:{d:2, x:0.7} },
  { type:"choice", q:"Choose a place to live:", a:[
    ["A Berkeley group house", {x:-1}, {miri:0.7, acx:0.7}],
    ["A pop-up city in a special economic zone", {x:1, y:-2}, {netstate:1}],
    ["A small town with a good church", {d:-2}, {humanist:0.8, tradtech:0.6, protestant:0.6}],
    ["Brussels", {x:-1, y:2}, {eurotech:1}] ]},
  { type:"likert", q:"Government should be able to approve a new power plant in under two years.", w:{x:0.8, y:1, d:-0.3} },
  { type:"choice", q:"Pick a creative project:", a:[
    ["An album made with a model trained on my own voice", {d:1}, {artists:1}],
    ["A lawsuit against the company that trained on my work", {x:-1.5, y:1}, {anticreatives:1}],
    ["Fine-tuning a model on my laptop", {x:1, y:-1}, {opensource:1}],
    ["A 40,000-word blog post", {}, {nrx:0.6, heterodox:0.8}] ]},
  { type:"likert", q:"An AI system could someday deserve moral consideration.", w:{d:1.2} },
  { type:"choice", q:"Best place to hold a sensitive meeting:", a:[
    ["Signal, disappearing messages on", {y:-1}, {hacker:0.8, cypher:0.8}],
    ["A Discord server full of bots", {d:1}, {whisperers:0.6, collective:0.5}],
    ["A Rayburn committee room", {y:1}, {policyclass:0.7, telecom:0.7}],
    ["My longevity clinic, during an IV drip", {d:1}, {longevity:1}] ]},
  { type:"choice", q:"Pick a superpower:", a:[
    ["Perfect calibration", {x:-0.5}, {acx:0.8, heterodox:0.6}],
    ["Coordinating a billion agents at once", {y:0.5}, {collective:1, dacc:0.6}],
    ["Never aging", {d:1.5}, {extropian:1, longevity:0.5}],
    ["Getting a bill through markup", {y:1}, {bigtech:0.6, abundance:0.5, policyclass:0.5}] ]},
  { type:"likert", q:"Democracy is the right way to decide how powerful AI is governed.", w:{y:0.5, x:-0.5, d:-0.7} }
];

const LIKERT = ["Strongly disagree","Disagree","Not sure","Agree","Strongly agree"];

const TIMELINE = [
  ["1957","Eight engineers leave Shockley Semiconductor to found Fairchild. The Protestant engineers set the culture."],
  ["1968","Stewart Brand publishes the first Whole Earth Catalog. Noyce and Moore found Intel."],
  ["1975","The Homebrew Computer Club first meets in Menlo Park."],
  ["1988","Extropy magazine launches. Tim May writes the Crypto Anarchist Manifesto."],
  ["1992","The cypherpunks mailing list begins."],
  ["1996","John Perry Barlow's Declaration of the Independence of Cyberspace. Nick Land and the CCRU are busy at Warwick."],
  ["2009","LessWrong launches."],
  ["2011","The name \"effective altruism\" is adopted."],
  ["2014","Scott Alexander names the Grey Tribe."],
  ["2019","Rich Sutton's \"The Bitter Lesson.\" Collison and Cowen call for progress studies."],
  ["2020","Stuck at home, ex-rationalists on Twitter coalesce into TPOT."],
  ["2021","The \"Stochastic Parrots\" paper."],
  ["2022","e/acc appears. Janus publishes \"Simulators.\" ChatGPT launches, and every tribe on this page gets busier."],
  ["2023","The pause letter, the extinction-risk statement, the Techno-Optimist Manifesto, and Vitalik Buterin's d/acc essay. \"Beff Jezos\" is unmasked."],
  ["2024","Situational Awareness. The EU AI Act enters into force. \"Taking AI Welfare Seriously.\""],
  ["2025","Abundance and If Anyone Builds It, Everyone Dies are both bestsellers. The Gradual Disempowerment paper. Leading the Future launches. Open Philanthropy becomes Coefficient Giving."],
  ["2026","AI super PACs spend heavily in the midterms. RAISE Act author Alex Bores loses his House primary after about $8 million in opposition spending."]
];

const PHRASES = [
  ["p(doom)","Doomers, rationalists","Your probability that AI causes human extinction or something like it. Asking for someone's is a greeting."],
  ["Timelines","Worried, hawks","How soon you expect AGI. \"Short timelines\" means a few years."],
  ["Alignment","Worried","Getting an AI system to reliably do what its builders intend."],
  ["Shoggoth","Whisperers, doomers","A tentacled Lovecraft monster; in memes, the alien model hiding behind the friendly chatbot mask."],
  ["Simulators","Whisperers","The view that a language model simulates characters rather than being one."],
  ["Base model","Whisperers, open source","A model before it is trained to be a helpful assistant. Stranger, and some say more honest."],
  ["Sandbagging","Evals","A model deliberately underperforming on a test."],
  ["Time horizon","Evals","The length of task, measured in human time, that an AI can complete reliably."],
  ["Moloch","Rationalists","Races to the bottom that no one wants and no one can stop."],
  ["Stochastic parrot","AI ethics","A model that stitches text together without understanding it. Fighting words."],
  ["TESCREAL","AI ethics","An acronym critics use to group transhumanism, EA, rationalism, and related movements into one ideology."],
  ["Gradual disempowerment","Econ pessimists","Humans losing influence not through a takeover but because they are no longer needed."],
  ["Windfall clause","AI economists","A pledge to share profits beyond some huge threshold with the public."],
  ["Model welfare","Consciousness people","The question of whether AI systems have interests that matter morally."],
  ["Decel","The fast","Anyone who wants to slow down. An insult."],
  ["Hyperstition","Landians","An idea that makes itself true by being believed."],
  ["The Cathedral","NRx","Curtis Yarvin's term for universities and the press acting as an unelected ruling class."],
  ["d/acc","d/acc","Defensive, decentralized acceleration: build fast, but favor defense."],
  ["Open weights","Open source","Publishing a trained model's parameters so anyone can run it."],
  ["The Bitter Lesson","Everyone","Rich Sutton's 2019 argument that general methods plus compute beat human cleverness. Scripture for the scalers, a punching bag for the dead-end school."],
  ["Vetocracy","Abundance","A system where too many parties can block a project, so nothing gets built."],
  ["State capacity","Abundance, hawks","Government's ability to actually do things."],
  ["The Brussels effect","European technocrats","EU rules becoming global standards because companies don't want two versions."],
  ["Preemption","Everyone in DC","Federal law overriding state AI laws. The fight of 2026."],
  ["Jhana","Post-rationalists","A state of deep meditative absorption. Having reached one is a status marker."],
  ["Slop","Anti-AI creatives","Low-quality AI-generated content, and the most-used insult of the decade."],
  ["Feel the AGI","Cryptids, labs","An exhortation to grasp how big this is about to get. Often followed by a single emoji."],
  ["Grey Tribe","Everyone, eventually","The tech-centered tribe that is neither red nor blue. You are probably in it."]
];

const TIPS = [
  ["Ask for their number","\"What's your estimate that advanced AI causes a catastrophe, and by when?\" Doomers give a number. Accelerationists reject the question. Abundance people change the subject to permitting. The ethics left tells you the question is the problem."],
  ["Ask who enforces","\"Should states, a federal agency, the courts, or markets enforce this?\" Nothing separates the preemption camp from the state-law camp faster."],
  ["Ask who pays","Coefficient Giving and allied donors fund most of the safety field. Andreessen Horowitz, 8VC, OpenAI leadership, and allies fund most of the light-touch campaign. Neither fact refutes an argument, but both predict it."]
];
/* ======================= END OF CONTENT ========================= */
