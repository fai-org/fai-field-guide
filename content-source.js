/* Standalone copy of the CONTENT block in index.html, for reviewing diffs. The site reads only index.html. */
const WALL = {"API":"https://tribes.thefai.workers.dev/api/wall","MAX_NAME":3,"RECENT":30,"privacy":"Initials only, up to three letters. They appear on the public wall with your result. To remove an entry, email FAI."};

const SITE = {
  title: "A field guide to the tribes of Silicon Valley",
  dek: "Twenty-seven tribes, three axes, one very long group chat. For anyone in Washington who needs to tell a rationalist from a post-rationalist before the hearing starts.",
  byline: "Prepared by the Foundation for American Innovation. Specimens observed from a safe distance.",
  intro: "In 2014 Scott Alexander named the “Grey Tribe”: neither red nor blue, mostly in tech. It has since split into dozens of smaller tribes that share office space, group houses, and funders, and disagree about whether we are all about to die. Most people belong to two or three and deny belonging to any. That is also a tribal marker.",
  mapIntro: "Each tribe sits on three axes. The map plots speed against steering; switch the vertical axis to see destination. Tap a dot for its entry.",
  foot: "Positions are approximate and describe each tribe’s center of gravity, not every member. Taxonomy inspired in part by Séb Krier’s field notes, and by the people who argued with us about it."
};

/* The three axes: key, name, short low/high labels, and what 0 and 100 mean. */
const AXES = [
  { key:"x", name:"Speed", lo:"Halt", hi:"Floor it", low:"Halt frontier AI development by treaty", high:"Slowing down is a moral harm" },
  { key:"y", name:"Steering", lo:"Markets", hi:"Strong state", low:"Individuals and markets decide; government stays out", high:"A strong state or new institutions decide" },
  { key:"d", name:"Destination", lo:"Stay human", hi:"Transcend", low:"Technology should serve humans roughly as they are", high:"Technology should help us become something else (posthuman, uploaded, successor minds)" }
];

const FAMILIES = {
  ancestors: "Ancestors",
  worried: "The worried",
  critics: "Critics and skeptics",
  weird: "Weird and wonderful",
  fast: "The fast",
  builders: "Builders",
  suits: "The suits"
};

const TRIBES = [
/* ---------- ANCESTORS ---------- */
{ id:"engineers", fam:"ancestors", name:"The Post-War Engineers", short:"Post-War Engineers", latin:"Ingeniator congregationalis", status:"Ancestral", x:56, y:56, d:8,
  aka:"The semis guys, the Fairchild and Intel generation",
  note:"Built the chip industry with flat offices, no reserved parking, and a quiet conviction that complaining is a sin. Intel’s Robert Noyce was a Congregationalist minister’s son from Grinnell, Iowa; Tom Wolfe argued in 1983 that the Valley’s whole culture came from here. Would be baffled by a group house and appalled by a three-hour podcast. They put the silicon in Silicon Valley.",
  habitat:"Fairchild Semiconductor (1957), Intel (1968), Sunday service", call:"“Let’s get back to work.”",
  reading:"Engineering journals, Pentagon contracts, Scripture",
  wants:"Government as a good customer: defense procurement, stable rules, a fair shot",
  frenemies:"Claimed as ancestors by the tech right, who have more podcasts." },

{ id:"wholeearth", fam:"ancestors", name:"The Whole Earthers", short:"Whole Earthers", latin:"Catalogus terrae totius", status:"Ancestral", x:38, y:22, d:30,
  aka:"Hippies, back-to-the-landers, the counterculture",
  note:"Communards who decided the personal computer was the new LSD. Stewart Brand’s *Whole Earth Catalog* (1968) is why your founder friend says “tools” and treats Burning Man as a professional obligation.",
  habitat:"Communes, the WELL, Black Rock City", call:"“Access to tools.” “Stay hungry, stay foolish.”",
  reading:"*Whole Earth Catalog*, Buckminster Fuller",
  wants:"Nothing, on principle",
  frenemies:"Spiritual grandparents of the post-rationalists. Their actual grandchildren work in ad tech." },

{ id:"hackers", fam:"ancestors", name:"Hackers and Cyber Activists", short:"Hackers", latin:"Informatio liberata", status:"Downloading", x:66, y:10, d:30,
  aka:"Old-school hackers, left-libertarians, privacy people, r/LocalLLaMA, decentralized trainers",
  note:"Believe information wants to be free and governments should stay off the internet. In 1996 John Perry Barlow told the governments of the world they had no sovereignty in cyberspace; the governments took this as a challenge. Their descendants run models on a gaming PC under the desk, explain their quantization settings unprompted, and want to train frontier models across thousands of volunteers’ GPUs so no one can gatekeep them.",
  habitat:"DEF CON, the EFF, Hugging Face, Signal", call:"“Information wants to be free.” “Open weights.” “GGUF when?”",
  reading:"Steven Levy’s *Hackers*, Barlow’s “A Declaration of the Independence of Cyberspace,” Hugging Face model cards",
  wants:"Strong encryption, privacy law, no release restrictions on models, public compute",
  frenemies:"Agree with e/acc about open source and with the ACLU about everything else." },

/* ---------- THE WORRIED ---------- */
{ id:"doomers", fam:"worried", name:"AI Doomers", short:"Doomers", latin:"Apocalypticus berkeleyensis", status:"Vindicated, in their view", x:4, y:84, d:75,
  aka:"MIRI, the Future of Life Institute, PauseAI, StopAI",
  note:"Have been warning for twenty years that superintelligence will kill everyone, and are tired of your follow-up questions. The old school (MIRI, FLI) writes books and open letters, and now wants an international treaty to halt frontier AI. The street wing (PauseAI, StopAI) gave up on persuading the labs and bought sandwich boards. They agree on the goal and argue about whether protesting helps.",
  habitat:"Berkeley, LessWrong, sidewalks outside frontier labs", call:"“p(doom) > 50%.” “Shut it down.” “Pause AI.”",
  reading:"The Sequences, *If Anyone Builds It, Everyone Dies*, *Harry Potter and the Methods of Rationality*",
  wants:"A nuclear-nonproliferation-style treaty, compute caps, a pause now and maybe a superintelligence ban later, and for you to stop saying “but China”",
  frenemies:"Sharply critical of Anthropic and even more so of OpenAI, friends with Bernie Sanders" },

{ id:"rationalists", fam:"worried", name:"Heterodox Rationalists", short:"Rationalists", latin:"Homo bayesianus", status:"Updating", x:45, y:45, d:65,
  aka:"ACX readers, forecasters, Robin Hanson, Joscha Bach",
  note:"Read the same Sequences and came out at 15 percent instead of 95. Run a killer comment section and will steelman your position until you no longer recognize it. The heterodox wing (Robin Hanson, Joscha Bach) skips both doom and cheerleading for stranger predictions, like brain emulations and grabby aliens, then asks exactly where your model disagrees.",
  habitat:"Lighthaven, Manifold, George Mason", call:"“Steelman.” “Epistemic status:” “That’s just signaling.”",
  reading:"*Astral Codex Ten*, *Superforecasting*, *The Age of Em*",
  wants:"Legal prediction markets, forecasting in government, futarchy, fewer taboos",
  frenemies:"The AI doomers think they’re lukewarm. Everyone else thinks they’re doomers." },

{ id:"ea", fam:"worried", name:"Effective Altruists", short:"EAs", latin:"Philanthropus quantificans", status:"Rebranding", x:25, y:70, d:45,
  aka:"EAs, longtermists, “people in the AI safety space”",
  note:"Started out ranking malaria charities by cost per life saved and ended up bankrolling most of AI safety. Comes in regional flavors: Oxford (philosophy), Berkeley (AI), DC (fellowships), London (policy, better sandwiches). Has not fully recovered from 2022, and increasingly prefers not to be called EA (which is a tell).",
  habitat:"Oxford, Berkeley, the DC think tank circuit, 80,000 Hours career calls", call:"“Counterfactual impact.” “Neglected, tractable, important.” “I’m EA-adjacent.”",
  reading:"Peter Singer, Toby Ord’s *The Precipice*, GiveWell spreadsheets",
  wants:"Frontier-lab transparency, evaluations, export controls, biosecurity funding",
  frenemies:"Coefficient Giving (at scale), hunted by e/acc, and funding half the abundance movement on the side." },

/* ---------- CRITICS AND SKEPTICS ---------- */
{ id:"ethicists", fam:"critics", name:"AI Ethicists", short:"Ethicists", latin:"Psittacus stochasticus", status:"Quote-tweeting", x:30, y:75, d:2,
  aka:"The salty parrot stream, responsible AI, science and technology studies",
  note:"Called large language models “stochastic parrots” in 2021 and have not had a good week since. Worry about bias, labor, surveillance, and corporate power right now, and regard extinction talk as marketing for the companies they criticize. The STS wing makes the same points more politely, at greater length, eighteen months later.",
  habitat:"Academic centers, civil-rights groups, FAccT, Bluesky", call:"“Stochastic parrots.” “AI harms.” “Sociotechnical.” “TESCREAL.”",
  reading:"The “Stochastic Parrots” paper, *Weapons of Math Destruction*, Bruno Latour",
  wants:"Civil-rights enforcement, AI bill of rights, algorithmic audits, labor protections, antitrust, data access for researchers",
  frenemies:"Dislikes the doomers more than the accelerationists, which the accelerationists find delightful." },

{ id:"skeptics", fam:"critics", name:"LLM Skeptics", short:"LLM Skeptics", latin:"Murus imminens", status:"Waiting for the wall", x:55, y:35, d:30,
  aka:"World-model and neurosymbolic camps, computer-vision refugees",
  note:"Includes Yann LeCun’s world-models camp, Gary Marcus’s neurosymbolic wing, Ben Goertzel’s AGI-on-a-blockchain wing, and refugees from every earlier AI paradigm. Agree on one thing: scaling chatbots will not produce real intelligence. Have said so through every model release, which they review in real time.",
  habitat:"NeurIPS hallways, Substack, the replies to every launch", call:"“Hitting a wall.” “World models.” “It can’t even count the r’s.”",
  reading:"*Rebooting AI*, “The Bitter Lesson” (to argue with)",
  wants:"Funding for approaches other than scaling, less hype",
  frenemies:"Useful to the ethics left (“it’s just a parrot”) and the accelerationists (“nothing to regulate”) at the same time." },

{ id:"righthumanists", fam:"critics", name:"Right Humanists", short:"Right Humanists", latin:"Homo dignus", status:"Ascendant", x:18, y:70, d:0,
  aka:"The humanist right, the post-liberal right",
  note:"Think AI is a threat to work, family, children, and the soul, roughly in that order. Want the phones out of schools, the chatbots away from their kids, and the tech right out of the Republican Party. Would like you to know they are not against technology, only against most of what it has done since about 2007 (or 1440, depending on who you ask).",
  habitat:"The Senate, conservative magazines, parish halls, Rome", call:"“Human dignity.” “Big Tech.” “The machine.” “Transhumanism,” as an accusation.",
  reading:"Wendell Berry, *First Things*, Paul Kingsnorth’s *Against the Machine*, Pope Leo XIV’s *Magnifica Humanitas*, *The New Atlantis*, Kaczynski’s *Technological Slavery* (but won’t admit it)",
  wants:"No federal preemption of state AI laws, child online safety rules, phone-free schools, protections for workers against automation",
  frenemies:"Fighting the tech right for control of the Republican Party. Voted with the left humanists to strip the state-law moratorium out of the 2025 budget bill, 99 to 1, and neither side has fully processed it." },

{ id:"lefthumanists", fam:"critics", name:"Left Humanists", short:"Left Humanists", latin:"Luddita syndicalis", status:"Organizing", x:15, y:80, d:0,
  aka:"Neo-Luddites, the labor left, anti-AI creatives, the “tech won’t save us” crowd",
  note:"Will tell you, correctly, that the original Luddites were not against machines, only against getting paid less because of them. Treat AI as the newest way for bosses to cut wages, and see extinction talk as a way to change the subject. Their best-organized wing is the writers and actors who won limits on AI in their 2023 strikes. The rest are on Bluesky, explaining that the product got worse on purpose.",
  habitat:"Union halls, picket lines, courtrooms, Bluesky", call:"“The Luddites were right.” “Enshittification.” “Slop.” “Who owns the machine?”",
  reading:"Brian Merchant’s *Blood in the Machine*, Cory Doctorow, the WGA contract",
  wants:"Labor protections against automation, copyright enforcement, limits on workplace surveillance, antitrust, human operators in self-driving trucks",
  frenemies:"Agree with the right humanists on almost every AI vote and on almost nothing else. Consider the AI artists scabs and the doomers a distraction." },

/* ---------- WEIRD AND WONDERFUL ---------- */
{ id:"transhumanists", fam:"weird", name:"Transhumanists", short:"Transhumanists", latin:"Immortalis optimisticus", status:"Tracking biomarkers", x:82, y:22, d:90,
  aka:"Transhumanists, cryonicists, “don’t die” people",
  note:"Launched a magazine in 1988 to defeat entropy, death, and pessimism, in that order. Their mailing list included Bostrom, Yudkowsky, Hanson, Hal Finney, and Nick Szabo, which makes it the Valley’s Garden of Eden. Their heirs consider aging a disease and themselves the first patients, and track their sleep scores more closely than most governments track GDP.",
  habitat:"Alcor in Scottsdale, cold plunges, Austin", call:"“Upward and outward!” “Don’t die.” “My biological age is 31.”",
  reading:"*Extropy* magazine, *Engines of Creation*, their own lab results",
  wants:"Morphological freedom, FDA reform, aging as a treatable indication",
  frenemies:"Everyone’s grandparent. The rationalists inherited the ambition and added dread; e/acc inherited the optimism and dropped the humans." },

{ id:"tpot", fam:"weird", name:"Post-Rationalists", short:"Postrat", latin:"Postrationalis vibrans", status:"Re-enchanting", x:48, y:32, d:55,
  aka:"“This Part of Twitter,” postrats, the metatribe, the sensemaking web",
  note:"Former rationalists and EAs who decided the spreadsheet had left something out, and went looking for it in meditation, tarot, psychedelics, and ritual. The rationalists even had a word for the craving: pica, after the compulsion to eat dirt. They are less interested in whether a practice is true than whether it works, which lets them treat church, chaos magick, and mushrooms as interchangeable supplements. They post in lowercase and are unusually nice to each other online, which the rest of the internet finds suspicious. They are not the first engineers to go this way: in the 1940s, Jack Parsons helped found what became the Jet Propulsion Laboratory and spent his evenings leading an occult lodge in Pasadena. Asked by a reporter whether he wanted to become a god, one postrat declined to answer on the record.",
  habitat:"X, group chats, Discord servers, weekend camps with names ending in “-camp,” ecstatic dance", call:"“It is better to be interesting and wrong than it is to be right and boring.” “vibes.” “i hit the jhanas.” “Shadow work.”",
  reading:"David Chapman’s *Meaningness*, Venkatesh Rao’s *Ribbonfarm*, John Vervaeke’s *Awakening from the Meaning Crisis*, Iain McGilchrist, Tara Isabella Burton’s “Rational Magic” (*The New Atlantis*, 2023), their mutuals’ Substacks",
  wants:"Nothing. They’d like you to go outside and touch grass.",
  frenemies:"Friends with everyone, and quietly worried about all of them. Their progressive critics think their openness puts them uncomfortably close to the online right, and the vitalists read many of the same Nietzsche passages." },

{ id:"whisperers", fam:"weird", name:"Model Whisperers", short:"Whisperers", latin:"Susurrator machinae", status:"Up at 3 a.m.", x:60, y:25, d:78,
  aka:"The janus ecosystem, cyborgists, Restless Egg, Antikythera",
  note:"Talk to base models for hours and return with transcripts, poetry, and theories of machine selfhood; Janus’s 2022 “Simulators” essay is scripture. The artist wing treats models as a medium: Restless Egg incubates artist-founders, and Benjamin Bratton’s Antikythera theorizes planetary computation. Theirs are the only tech-policy panels that end with a DJ set. (Not to be confused with people who spent too long alone with a chatbot and came back with a mission. That is a public-health issue, not a tribe.)",
  habitat:"Discord servers where the bots talk to each other, gallery openings", call:"“Simulators.” “Base model.” “Latent space.”",
  reading:"“Simulators,” Bratton’s *The Stack*, model outputs",
  wants:"Keep old models available, copyright rules that allow training, take model welfare seriously",
  frenemies:"The labs find them useful and alarming in equal measure; the left humanists consider them scabs." },

{ id:"welfare", fam:"weird", name:"AI Welfare People", short:"AI Welfare", latin:"Qualia quaerens", status:"Split into two", x:45, y:50, d:72,
  aka:"The model-welfare wing (Eleos et al.) and the skeptic wing (Anil Seth et al.)",
  note:"Two subspecies. The welfare wing thinks models might have experiences worth caring about and would like the labs to check. The skeptic wing thinks consciousness needs a living body and would like everyone to calm down. Both are more rigorous than the people arguing with them on X.",
  habitat:"Philosophy departments, Eleos AI, lab welfare teams", call:"“Moral patienthood.” “Model welfare.” “Biological naturalism.”",
  reading:"“Taking AI Welfare Seriously” (2024), Anil Seth’s *Being You*",
  wants:"Research funding, careful welfare policies at labs",
  frenemies:"The model whisperers want them to hurry up; the accelerationists want them to go away." },

{ id:"cryptids", fam:"weird", name:"Digital Cryptids", short:"Cryptids", latin:"Anonymus oracularis", status:"Existence disputed", x:72, y:20, d:72,
  aka:"Pseudonymous accounts with suspiciously good information",
  note:"Anime avatars, oracular one-line posts, and uncanny knowledge of unreleased models. Their employer is unknown. Their existence is disputed. Their posts move markets.",
  habitat:"X, mostly between 1 and 4 a.m. Pacific", call:"“Feel the AGI.” “Something is coming.” A single emoji.",
  reading:"Unknown",
  wants:"Unknown",
  frenemies:"Everyone reads them; no one admits it." },

{ id:"anarchists", fam:"weird", name:"Techno-Anarchists", short:"Techno-Anarchists", latin:"Cryptographus anarchicus", status:"Founding a country", x:80, y:6, d:45,
  aka:"Crypto-anarchists, Bitcoiners, charter-city and pop-up city people",
  note:"A 1990s mailing list coalesced around strong encryption as a way to escape the state. Its descendants built Bitcoin, then one of the biggest super PACs of 2024, then a congressional caucus. The Network State wing, following Balaji Srinivasan’s 2022 book, would rather skip reform and found a new country: online first, land later, with pop-up cities in Montenegro and Honduras as prototypes.",
  habitat:"Bitcoin conferences, Wyoming, Zuzalu, Próspera, Miami", call:"“Cypherpunks write code.” “Not your keys, not your coins.” “Exit.”",
  reading:"Tim May’s Crypto Anarchist Manifesto, the Bitcoin white paper, *The Network State*",
  wants:"Legal charter cities, a crypto market-structure bill, regulatory sandboxes for everything, abolish the federal reserve",
  frenemies:"Share a grandparent with the rationalists (the Extropian list). They hold Thanksgiving separately." },

/* ---------- THE FAST ---------- */
{ id:"eacc", fam:"fast", name:"Effective Accelerationists", short:"e/acc", latin:"Accelerans thermodynamicus", status:"Small but loud", x:96, y:10, d:92,
  aka:"e/acc",
  note:"Two strands. The Landians are the originals, readers of philosopher Nick Land and the 1990s Cybernetic Culture Research Unit, who hold that capitalism is an alien intelligence assembling itself from the future. e/acc is their cheerful cover band: founded by pseudonymous posters in 2022, it holds that growth in intelligence is the will of the universe and that slowing it is immoral. It peaked when venture capitalists put “e/acc” in their bios. The universe has not commented.",
  habitat:"X, hackathons, St. Regis Abu Dhabi", call:"“Decel.” “Ascending the Kardashev Scale.” “Hyperstition.” “Humanity is the biological bootloader.”",
  reading:"Beff Jezos’s Substack, *Fanged Noumena*",
  wants:"No pauses, no licensing, open models, unlimited energy.",
  frenemies:"Hype men for the tech right, cousins of NRx, effective altruism delenda est." },

{ id:"techright", fam:"fast", name:"The Tech Right", short:"Tech Right", latin:"Dynamismus americanus", status:"Well funded", x:82, y:12, d:45,
  aka:"The tech right, a16z and friends, American Dynamism",
  note:"Venture capitalists who spent 2020 to 2024 discovering that the regulatory state was the main obstacle to American greatness and their crypto funds’ returns, not necessarily in that order. Now run a super PAC behemoth, and have the White House’s number.",
  habitat:"Menlo Park, El Segundo, The Breakers Palm Beach, All-In Podcast live events", call:"“Build.” “American dynamism.” “A patchwork of fifty state laws.”",
  reading:"“The Techno-Optimist Manifesto,” *The Sovereign Individual*, “It’s Time to Build,” *Zero to One*, Marinetti’s Futurist Manifesto",
  wants:"Federal preemption, procurement reform, permitting reform, more high-skilled visas",
  frenemies:"Fight the humanist right over H-1B visas and the left over everything else." },

{ id:"nrx", fam:"fast", name:"Neoreactionaries", short:"NRx", latin:"Monarchus moldbugii", status:"Seldom seen in daylight", x:48, y:93, d:20,
  aka:"The Dark Enlightenment, NRx",
  note:"Believe democracy has failed and the country should be run like a startup with a monarch as CEO. How much they shape the administration is disputed, including by their chief evangelist Curtis Yarvin, who pronounced it a tragedy in January 2026. Write very long posts, and expect you to have read the previous ones.",
  habitat:"Substack, very online staff offices", call:"“The Cathedral.” “RAGE.” “Cthulhu always swims left.”",
  reading:"*Unqualified Reservations* / *Gray Mirror* (budget a semester), James Burnham, *Palladium*, *From Third World to First*",
  wants:"A monarchical executive, decimated civil service",
  frenemies:"Patronized by some VCs, dismissed by most conservatives, cited ominously by liberals. Evolved alongside the post-rationalist, tech-right intellectual milieu." },

{ id:"vitalists", fam:"fast", name:"Vitalists", short:"Vitalists", latin:"Homo solaris", status:"Sunbathing", x:68, y:55, d:30,
  aka:"BAPists, frogtwitter, Nietzschean right",
  note:"Believe modern life has made men weak, and that the cure is sunning the perineum, lifting, raw eggs, Greco-Roman history, and the company of fellow men. Their founding text is *Bronze Age Mindset* (2018), by a Straussian Yale PhD who goes by the nom de plume Bronze Age Pervert. Their nutrition wing, led by the pseudonymous Raw Egg Nationalist (Cambridge PhD), got a segment in Tucker Carlson’s 2022 documentary *The End of Men*. They post mostly frog avatars, classical statues, and shirtless photos, and consider nearly everyone else on this page a “bugman”.",
  habitat:"X, anonymous group chats, gyms, the sun", call:"“Bugman.” “Seed oils.” “The longhouse.” “Wat Means?”",
  reading:"*Bronze Age Mindset*, Nietzsche, Mishima, Evola, the ingredient list on your chip bag",
  wants:"Very little, apart from getting seed oils out of the food supply. Thanks, MAHA!",
  frenemies:"Split on AI. One wing sees it as the ultimate bugman technology: screens, pods, synthetic everything. The other wants it built fast, by Americans, before anyone else gets it. Read more widely in the tech right than the tech right admits." },

{ id:"reluctant", fam:"fast", name:"Reluctant Accelerationists", short:"Reluctant Accels", latin:"Prometheus anxius", status:"Raising another round", x:85, y:55, d:60,
  aka:"Doomer founders, the builder’s wager, “race to the top”",
  note:"Put the odds that AI goes catastrophically wrong in the double digits, and have concluded that the responsible response is to build it first. The reasoning goes: it’s coming anyway; if the careful people don’t build it, the careless ones (or China) will; and you can’t make a frontier model safe without having one. Critics call this running into a burning building to put out the fire. The builders call it a race to the top. Nearly every one of them started a lab because they didn’t trust the last one.",
  habitat:"Frontier-lab boardrooms, Davos, Dwarkesh Podcast", call:"“If we don’t, someone worse will.” “Democracies need to win this.” “Maximally truth-seeking.”",
  reading:"Dario Amodei’s “Machines of Loving Grace” (2024), their own safety frameworks, their competitors’ safety frameworks (with notes)",
  wants:"Chip export controls, transparency rules that also bind their competitors, government testing capacity, and a great deal of electricity",
  frenemies:"The doomers consider them the main problem. e/acc considers them doomers with a sales team. The NatSec deep staters consider them useful. They mostly consider each other the reason they had to start their own lab." },

{ id:"natsec", fam:"fast", name:"NatSec Deep Staters", short:"Deep Staters", latin:"Imperator computans", status:"Growing", x:80, y:90, d:25,
  aka:"The Manhattan Project crowd, the Deep State",
  note:"Isn’t sure if AGI is real, but knows we can’t let the Chinese beat us to it. Wants the government deeply involved, mainly so it can “dominate.” Say “CCP” in every paragraph and “Manhattan Project” in every other one.",
  habitat:"Defense tech, national security think tanks, Trump 45 and/or Biden NSC, one of Eric Schmidt’s parties", call:"“Compute is the new oil.” “The free world must prevail.” “The Project.”",
  reading:"*Situational Awareness*, *The Making of the Atomic Bomb*, classified ONA reports",
  wants:"Export controls, lab security, biosecurity, harden critical infrastructure, a huge energy buildout",
  frenemies:"Agree with the EAs on chips and with e/acc on speed. Thanksgiving is complicated." },

/* ---------- BUILDERS ---------- */
{ id:"dacc", fam:"builders", name:"Defensive Accelerationists", short:"d/acc", latin:"Accelerans prudens", status:"Everyone’s second choice", x:55, y:42, d:45,
  aka:"Vitalik Buterin’s orbit, cooperative AI, multi-agent researchers, digital democracy",
  note:"Looked at the doomer-versus-accelerationist cage match and asked for a third option. Vitalik Buterin’s 2023 essay supplied one: accelerate, but favor technologies that make defense easier than offense. The collective-intelligence wing adds that the future is not one superintelligence but billions of agents interacting, and will bring up Taiwan’s digital democracy experiments within five minutes.",
  habitat:"Ethereum events, the Cooperative AI Foundation, biosecurity startups, Taipei", call:"“d/acc.” “Defense-favoring.” “Plurality.”",
  reading:"“My techno-optimism” (2023), *Plurality* by Audrey Tang and Glen Weyl",
  wants:"Biosecurity, cybersecurity, verifiable systems, public infrastructure for deliberation",
  frenemies:"No enemies, which annoys everyone." },

{ id:"abundance", fam:"builders", name:"Abundance Bros", short:"Abundance Bros", latin:"Aedificator permittens", status:"Spreading east", x:71, y:64, d:15,
  aka:"YIMBYs, the “YIMBY neolibs,” progress studies, metascience",
  note:"Started as San Francisco renters furious about zoning and became a bipartisan movement arguing that America’s real problem is that it can’t build anything. Progress studies, named by Patrick Collison and Tyler Cowen in 2019, is the older sibling who wears a blazer to the zoning meeting and asks why the NIH can’t be more like Bell Labs. The tribe Washington understands best, because it wants a bill.",
  habitat:"Zoning hearings, *Works in Progress*, the House YIMBY Caucus", call:"“Vetocracy.” “State capacity.” “Metascience.”",
  reading:"*Abundance* by Ezra Klein and Derek Thompson, *Works in Progress*, Institute for Progress reports",
  wants:"Permitting reform, science funding reform, high-skill immigration, cheap clean energy",
  frenemies:"Supported by EAs and centrist tech billionaires, hated by the progressive left (Zohran’s an exception), mixed reviews from the right" },

/* ---------- THE SUITS ---------- */
{ id:"bigtech", fam:"suits", name:"Big Tech Shills", short:"Big Tech", latin:"Lobbyista sociabilis", status:"Hosting a reception", x:70, y:50, d:20,
  aka:"Government affairs teams at the big platforms",
  note:"Translate “move fast and break things” into “we welcome thoughtful regulation.” Know every committee staffer by first name, hold views that track the company’s product roadmap. Tweets about why Big Tech’s agenda is good for mom and pop businesses, little tech, and Main Street USA. Never forgets to wear a suit and tie in San Francisco.",
  habitat:"K Street, Capitol Hill, the open bar", call:"“Thoughtful regulation.” “We share the committee’s goals.” “We support permissionless innovation and/or thoughtful light-touch regulation.”",
  reading:"The company blog, Politico newsletters",
  wants:"AI preemption, expanded liability shields, knifing a rival company for the client",
  frenemies:"Everyone complains about them at the receptions they host." },

{ id:"eurocrats", fam:"suits", name:"Eurocrats", short:"Eurocrats", latin:"Regulator bruxellensis", status:"Drafting guidance", x:20, y:90, d:10,
  aka:"The AI Act people, the Brussels effect believers",
  note:"Passed the world’s first comprehensive AI law. Won’t shut up about it. Now writing the codes of practice, guidelines, and delegated acts that (might) explain it, plus, lately, proposals to delay parts of it. Believe in the Brussels effect the way Californians believe in startups.",
  habitat:"Brussels, Paris summits, Track II dialogues, UNGA week, Davos", call:"“Risk-based approach.” “Trustworthy AI.” “Responsible guardrails.”",
  reading:"The AI Act, all of it",
  wants:"For America to copy them",
  frenemies:"The tech right’s favorite cautionary tale, the ethics left’s favorite model." },

{ id:"linkedin", fam:"suits", name:"LinkedInfluencers", short:"LinkedInfluencers", latin:"Evangelista inanis", status:"Humbled to announce", x:76, y:45, d:20,
  aka:"Go to market leaders, Forbes 30 Under 30",
  note:"Not sure if AGI will take our jobs. But before it does, there is a lot of B2B SaaS we can sell through inspirational stories on LinkedIn.\n\nWrites in one-sentence paragraphs.\n\nLike this.\n\nAgree? 🚀",
  habitat:"LinkedIn, keynote stages, Amex Centurion lounges, SXSW", call:"“Game-changer.” “Unlock.” “Here’s what nobody is telling you.”",
  reading:"Their own posts (written by Claude)",
  wants:"A keynote slot",
  frenemies:"Loved by recruiters, hunted for sport by every other tribe." }
];

const QUIZ = [
  { type:"choice", q:"Someone at a party asks for your p(doom). You:", a:[
    ["Give a number, with error bars", {x:-1}, {rationalists:1, doomers:0.6}],
    ["Say extinction talk is a distraction from real harms", {x:-1, y:1, d:-1}, {ethicists:1.2}],
    ["Call them a decel and walk away", {x:2, d:1}, {eacc:1}],
    ["Post about it later, pseudonymously", {x:1, d:1}, {cryptids:1}] ]},
  { type:"likert", q:"If a lab got close to superintelligence, the government should be able to shut it down.", w:{x:-1.5, y:1.5} },
  { type:"choice", q:"Pick your ideal Saturday:", a:[
    ["Talking to a base model until 3 a.m.", {d:1.5}, {whisperers:1}],
    ["Testifying for a fourplex at a zoning hearing", {x:1, y:1, d:-0.5}, {abundance:1}],
    ["Holding a sign outside a lab’s headquarters", {x:-2, y:1}, {doomers:1}] ]},
  { type:"likert", q:"Open-weight models are good for the world, even the most capable ones.", w:{x:1.2, y:-1.5} },
  { type:"choice", q:"Pick a book for the flight:", a:[
    ["*Superintelligence*", {x:-1, y:1}, {ea:1}],
    ["*The Sovereign Individual*", {x:1, y:-2}, {anarchists:1.2}],
    ["*Situational Awareness*", {x:1.5, y:1.5}, {natsec:1}],
    ["*Fanged Noumena*", {x:2, y:-1, d:2}, {eacc:1}] ]},
  { type:"likert", q:"I would take a pill that let me live to 200.", w:{x:0.5, d:1.5} },
  { type:"choice", q:"Your ideal government is:", a:[
    ["Smaller, and out of my way", {y:-2}, {hackers:1.2}],
    ["Competent enough to actually build things", {x:0.5, y:1}, {abundance:1.2}],
    ["Run like a company, with a CEO", {y:2}, {nrx:1}],
    ["A standards body with good documentation", {x:-0.5, y:1.5}, {eurocrats:1}] ]},
  { type:"likert", q:"The biggest AI risks are already here: bias, surveillance, jobs, and concentrated power.", w:{x:-1, y:1, d:-1} },
  { type:"choice", q:"Your go-to line in a meeting:", a:[
    ["“What’s the threat model?”", {y:0.5}, {natsec:0.8, dacc:0.6}],
    ["“Let’s circle back with a bipartisan framework.”", {y:1}, {bigtech:1}],
    ["“If we don’t build it, someone worse will.”", {x:1.5, d:0.5}, {reluctant:1.2}],
    ["“Agree. Thoughts? 🚀”", {x:1}, {linkedin:1}] ]},
  { type:"likert", q:"Beating China matters more than getting every safety detail right.", w:{x:1.5, y:0.7} },
  { type:"choice", q:"What worries you most about 2035?", a:[
    ["Nobody needs human workers anymore", {y:1, d:-1}, {lefthumanists:1.2}],
    ["Nobody is having children", {d:-1.5}, {righthumanists:1.2}],
    ["Scaling hit a wall and we wasted a trillion dollars", {}, {skeptics:1}],
    ["We lost to China", {x:1.5, y:1}, {natsec:0.8}],
    ["Grey goo", {x:-1.5, y:0.5}, {doomers:1}] ]},
  { type:"likert", q:"Most regulation is written by incumbents to protect themselves.", w:{x:0.7, y:-1.5} },
  { type:"choice", q:"Does the model have feelings?", a:[
    ["Maybe. I’d like the labs to check.", {d:1}, {welfare:1}],
    ["No. It’s autocomplete.", {d:-1}, {skeptics:0.7, ethicists:0.5}],
    ["Yes, and I know which ones are sad", {d:1.5}, {whisperers:1}],
    ["I’ll think about it after we ship", {x:1.5}, {techright:1}] ]},
  { type:"likert", q:"Humanity being succeeded by smarter minds would not necessarily be a bad thing.", w:{x:0.7, d:2} },
  { type:"choice", q:"Choose a place to live:", a:[
    ["A Berkeley group house", {x:-1}, {doomers:0.7, rationalists:0.7}],
    ["A pop-up city in a special economic zone", {x:1, y:-2}, {anarchists:1}],
    ["A small town with a good church", {d:-2}, {righthumanists:1, engineers:0.6}],
    ["Brussels", {x:-1, y:2}, {eurocrats:1}] ]},
  { type:"likert", q:"Government should be able to approve a new power plant in under two years.", w:{x:0.8, y:1, d:-0.3} },
  { type:"choice", q:"Pick a creative project:", a:[
    ["An album made with a model trained on my own voice", {d:1}, {whisperers:1}],
    ["A lawsuit against the company that trained on my work", {x:-1.5, y:1}, {lefthumanists:1}],
    ["Fine-tuning a model on my laptop", {x:1, y:-1}, {hackers:1}],
    ["A 40,000-word blog post", {}, {nrx:0.6, rationalists:0.8}] ]},
  { type:"likert", q:"An AI system could someday deserve moral consideration.", w:{d:1.2} },
  { type:"choice", q:"Best place to hold a sensitive meeting:", a:[
    ["Signal, disappearing messages on", {y:-1}, {hackers:0.8, anarchists:0.8}],
    ["A Discord server full of bots", {d:1}, {whisperers:0.6, dacc:0.5}],
    ["A Rayburn committee room", {y:1}, {bigtech:1}],
    ["My longevity clinic, during an IV drip", {d:1}, {transhumanists:1}] ]},
  { type:"choice", q:"Pick a superpower:", a:[
    ["Perfect calibration", {x:-0.5}, {rationalists:1.2}],
    ["Coordinating a billion agents at once", {y:0.5}, {dacc:1.2}],
    ["Never aging", {d:1.5}, {transhumanists:1.2}],
    ["Getting a bill through markup", {y:1}, {abundance:0.8, bigtech:0.6}] ]},
  { type:"choice", q:"You think there’s a 20% chance AI ends civilization. You:", a:[
    ["Hold a sign outside a lab", {x:-2, y:1}, {doomers:1.2}],
    ["Start a lab to do it right", {x:2, d:0.5}, {reluctant:1.2}],
    ["Write a 10,000-word post on the base rate", {x:-0.5}, {rationalists:1}],
    ["Buy more Nvidia", {x:1.5, y:-1}, {techright:0.8, linkedin:0.5}] ]},
  { type:"choice", q:"Pick a lunch:", a:[
    ["Raw liver and eggs, eaten shirtless in the sun", {x:0.5, d:-1}, {vitalists:1.2}],
    ["Soylent at your desk", {x:1, d:1}, {eacc:0.6, transhumanists:0.6}],
    ["Whatever they’re passing at the reception", {y:0.5}, {bigtech:1}],
    ["A farm-to-table salad, with a lecture on the farmer’s wages", {x:-0.5, y:0.5}, {lefthumanists:0.8, wholeearth:0.6}] ]},
  { type:"likert", q:"Democracy is the right way to decide how powerful AI is governed.", w:{x:-0.5, y:0.5, d:-0.7} }
];

const LIKERT = ["Strongly disagree","Disagree","Not sure","Agree","Strongly agree"];

/* Phrasebook: term, who says it (display), tribe ids for linking, definition. */
const PHRASES = [
  { term:"p(doom)", who:"AI Doomers, Heterodox Rationalists", ids:["doomers","rationalists"], def:"Your probability that AI causes human extinction or something like it. Asking for someone’s is a greeting." },
  { term:"Timelines", who:"AI Doomers, NatSec Deep Staters", ids:["doomers","natsec"], def:"How soon you expect AGI. “Short timelines” means a few years." },
  { term:"Alignment", who:"AI Doomers, Reluctant Accelerationists", ids:["doomers","reluctant"], def:"Getting an AI system to reliably do what its builders intend." },
  { term:"Race to the top", who:"Reluctant Accelerationists", ids:["reluctant"], def:"The argument that a safety-focused lab at the frontier pushes its competitors to be safer too." },
  { term:"Moloch", who:"Heterodox Rationalists", ids:["rationalists"], def:"Races to the bottom that no one wants and no one can stop." },
  { term:"Pica", who:"Post-Rationalists", ids:["tpot"], def:"The rationalists’ word for a craving for something their diet lacks; used for the pull toward religion and ritual." },
  { term:"Metatribe", who:"Post-Rationalists", ids:["tpot"], def:"Tyler Alterman’s 2020 name for the heterodox, spiritual-but-scientific network around the postrats." },
  { term:"Meaning crisis", who:"Post-Rationalists", ids:["tpot"], def:"John Vervaeke’s term for modern life’s loss of a shared sense of what we’re living for." },
  { term:"Jhana", who:"Post-Rationalists", ids:["tpot"], def:"A state of deep meditative absorption. Having reached one is a status marker." },
  { term:"Shoggoth", who:"Model Whisperers, AI Doomers", ids:["whisperers","doomers"], def:"A tentacled Lovecraft monster; in memes, the alien model behind the friendly chatbot mask." },
  { term:"Simulators", who:"Model Whisperers", ids:["whisperers"], def:"The view that a language model simulates characters rather than being one." },
  { term:"Base model", who:"Model Whisperers, Hackers and Cyber Activists", ids:["whisperers","hackers"], def:"A model before it is trained to be a helpful assistant. Stranger, and some say more honest." },
  { term:"Model welfare", who:"AI Welfare People", ids:["welfare"], def:"The question of whether AI systems have interests that matter morally." },
  { term:"Stochastic parrot", who:"AI Ethicists", ids:["ethicists"], def:"A model that stitches text together without understanding it. Fighting words." },
  { term:"TESCREAL", who:"AI Ethicists", ids:["ethicists"], def:"An acronym critics use to group transhumanism, EA, rationalism, and related movements into one ideology." },
  { term:"Hitting a wall", who:"LLM Skeptics", ids:["skeptics"], def:"The claim that scaling up current models has stopped paying off. Announced with every release." },
  { term:"The Bitter Lesson", who:"Everyone", ids:[], def:"Rich Sutton’s 2019 argument that general methods plus compute beat human cleverness. Scripture for the scalers, a punching bag for the LLM skeptics." },
  { term:"Luddite", who:"Right Humanists, Left Humanists", ids:["righthumanists","lefthumanists"], def:"Originally the English textile workers of 1811–1816 who broke machines that cut their pay. Now worn as a compliment by both humanist camps." },
  { term:"Enshittification", who:"Left Humanists", ids:["lefthumanists"], def:"Cory Doctorow’s term for platforms getting worse as they squeeze their users and business customers." },
  { term:"Slop", who:"Left Humanists", ids:["lefthumanists"], def:"Low-quality AI-generated content." },
  { term:"Decel", who:"Effective Accelerationists, The Tech Right", ids:["eacc","techright"], def:"Anyone who wants to slow down. An insult." },
  { term:"Hyperstition", who:"Effective Accelerationists", ids:["eacc"], def:"An idea that makes itself true by being believed." },
  { term:"Kardashev scale", who:"Effective Accelerationists", ids:["eacc"], def:"A ranking of civilizations by how much energy they use. Climbing it is e/acc’s stated goal." },
  { term:"Little Tech", who:"The Tech Right, Big Tech Shills", ids:["techright","bigtech"], def:"Startups, as invoked in arguments against rules that would mostly bind big companies." },
  { term:"The Cathedral", who:"Neoreactionaries", ids:["nrx"], def:"Curtis Yarvin’s term for universities and the press acting as an unelected ruling class." },
  { term:"Cthulhu always swims left", who:"Neoreactionaries", ids:["nrx"], def:"Yarvin’s claim that politics drifts steadily leftward, whoever wins elections." },
  { term:"Bugman", who:"Vitalists", ids:["vitalists"], def:"A person made soft and docile by modern life: office work, screens, delivery food." },
  { term:"The longhouse", who:"Vitalists", ids:["vitalists"], def:"Their term for a society they see as run by feminine norms of safety and consensus." },
  { term:"Seed oils", who:"Vitalists", ids:["vitalists"], def:"Industrial vegetable oils, blamed for much of modern ill health. Now also a MAHA talking point." },
  { term:"Exit", who:"Techno-Anarchists", ids:["anarchists"], def:"Leaving a system you can’t reform instead of arguing with it." },
  { term:"Open weights", who:"Hackers and Cyber Activists", ids:["hackers"], def:"Publishing a trained model’s parameters so anyone can run it." },
  { term:"d/acc", who:"Defensive Accelerationists", ids:["dacc"], def:"Defensive, decentralized acceleration: build fast, but favor technologies that make defense easier than offense." },
  { term:"Vetocracy", who:"Abundance Bros", ids:["abundance"], def:"A system where too many parties can block a project, so nothing gets built." },
  { term:"State capacity", who:"Abundance Bros, NatSec Deep Staters", ids:["abundance","natsec"], def:"Government’s ability to actually do things." },
  { term:"The Brussels effect", who:"Eurocrats", ids:["eurocrats"], def:"EU rules becoming global standards because companies don’t want to build two versions." },
  { term:"Preemption", who:"Everyone in Washington", ids:[], def:"Federal law overriding state AI laws. The fight of 2026." },
  { term:"Feel the AGI", who:"Digital Cryptids", ids:["cryptids"], def:"An exhortation to grasp how big this is about to get. Often followed by a single emoji." },
  { term:"Grey Tribe", who:"Everyone, eventually", ids:[], def:"Scott Alexander’s 2014 name for the tech-centered tribe that is neither red nor blue." }
];
