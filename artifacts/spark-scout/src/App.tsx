import { useMemo, useState } from 'react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowLeft, ArrowRight, Atom, BookOpen, Brain, Check, ChevronDown, ChevronUp,
  Code2, ExternalLink, Heart, Laptop, Lightbulb, LockKeyhole, MapPin, Palette,
  PencilRuler, Puzzle, RotateCcw, Search, ShieldCheck, Sparkles, SpellCheck,
  Sprout, Users, Wifi, Wrench,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Interest = 'STEM & robotics' | 'Math & puzzles' | 'Writing & history' | 'Art & design' | 'Coding & technology' | 'Speaking & spelling' | 'Teamwork & creative problem-solving';
type Format = 'in-person' | 'online' | 'both';
type Opportunity = {
  id: string;
  title: string;
  organizer: string;
  ageRange: [number, number];
  gradeRange: string;
  interests: Interest[];
  format: Format;
  summary: string;
  matchReason: string;
  localGuidance: string;
  eligibilityNote: string;
  seasonNote: string;
  officialUrl: string;
  tags?: string[];
  participation: 'solo' | 'team' | 'either';
  challenge: 'steady' | 'stretch' | 'either';
};

const opportunities: Opportunity[] = [
  {
    id: 'first-lego',
    title: 'FIRST LEGO League',
    organizer: 'FIRST',
    ageRange: [6, 16], gradeRange: 'Grades 2–8 (division and local rules vary)',
    interests: ['STEM & robotics', 'Coding & technology', 'Teamwork & creative problem-solving'],
    format: 'in-person',
    summary: 'A team-based robotics program where young people design, build, and program a LEGO robot, then explore a real-world theme.',
    matchReason: 'A welcoming way to combine hands-on engineering, coding, and shared problem-solving.',
    localGuidance: 'Teams and events are organized through local partners. Use FIRST’s program page to explore participation options; this finder does not verify nearby teams.',
    eligibilityNote: 'FIRST LEGO League divisions have distinct age and grade bands. Confirm the division and team rules for your area.',
    seasonNote: 'Recurring annual program; season themes, event calendars, costs, and registration windows change.',
    officialUrl: 'https://www.firstinspires.org/robotics/fll',
    tags: ['Robotics', 'Team challenge'], participation: 'team', challenge: 'either',
  },
  {
    id: 'first-robotics',
    title: 'FIRST Tech Challenge',
    organizer: 'FIRST',
    ageRange: [12, 18], gradeRange: 'Grades 7–12 (local program rules apply)',
    interests: ['STEM & robotics', 'Coding & technology', 'Teamwork & creative problem-solving'],
    format: 'in-person',
    summary: 'Students work in teams to design, build, and program robots for a new game challenge, then compete and share engineering ideas.',
    matchReason: 'A deeper robotics build for someone ready to collaborate on a larger engineering challenge.',
    localGuidance: 'Teams and competitions are hosted by local FIRST partners. Browse the official program information and ask about teams in your community.',
    eligibilityNote: 'Age and grade eligibility can vary by division and region. Check current FIRST rules before joining.',
    seasonNote: 'Recurring annual season; challenge details, dates, team costs, and availability change.',
    officialUrl: 'https://www.firstinspires.org/robotics/ftc',
    tags: ['Robotics', 'Engineering'], participation: 'team', challenge: 'stretch',
  },
  {
    id: 'mathcounts',
    title: 'MATHCOUNTS Competition Series',
    organizer: 'MATHCOUNTS Foundation',
    ageRange: [11, 14], gradeRange: 'Middle school, typically grades 6–8',
    interests: ['Math & puzzles', 'Teamwork & creative problem-solving'],
    format: 'in-person',
    summary: 'A middle-school math program with team preparation and friendly individual and team competition rounds.',
    matchReason: 'Great for a young math thinker who enjoys clever problems and a little competitive energy.',
    localGuidance: 'Participation is generally through a school or local chapter. The official site explains chapter participation and competition pathways.',
    eligibilityNote: 'Designed for middle-school students; confirm grade, school participation, and chapter rules with MATHCOUNTS.',
    seasonNote: 'Recurring school-year series; chapter schedules, fees, and qualification rules can change.',
    officialUrl: 'https://www.mathcounts.org/programs/mathcounts-competition-series',
    tags: ['Math', 'Competition'], participation: 'either', challenge: 'stretch',
  },
  {
    id: 'science-olympiad',
    title: 'Science Olympiad',
    organizer: 'Science Olympiad',
    ageRange: [10, 18], gradeRange: 'Division B: grades 6–9; Division C: grades 9–12',
    interests: ['STEM & robotics', 'Math & puzzles', 'Teamwork & creative problem-solving'],
    format: 'in-person',
    summary: 'A team competition with a wide mix of science and engineering events, from building and lab work to knowledge challenges.',
    matchReason: 'There are many event styles, so students can explore different corners of science together.',
    localGuidance: 'Teams compete through state organizations and local tournaments. Use the official state-organizations directory; no nearby event is implied.',
    eligibilityNote: 'Division eligibility depends on grade and the event rules. Confirm team and event requirements with your state organization.',
    seasonNote: 'Recurring annual tournament season; event lists, schedules, fees, and local availability change.',
    officialUrl: 'https://www.soinc.org/',
    tags: ['Science', 'Team events'], participation: 'team', challenge: 'either',
  },
  {
    id: 'national-history-day',
    title: 'National History Day',
    organizer: 'National History Day',
    ageRange: [11, 18], gradeRange: 'Grades 6–12 (junior and senior divisions)',
    interests: ['Writing & history', 'Art & design', 'Speaking & spelling'],
    format: 'both',
    summary: 'Students investigate a historical topic and present their work as a paper, exhibit, documentary, website, or performance.',
    matchReason: 'A strong fit for turning curiosity about the past into a researched, creative project.',
    localGuidance: 'Most students participate through a school or affiliated program and progress through regional and state contests. Check the official affiliate directory.',
    eligibilityNote: 'Junior and senior divisions are grade-based. Confirm project format and participation rules with the local affiliate.',
    seasonNote: 'Recurring annual theme and contest cycle; deadlines and affiliate availability vary.',
    officialUrl: 'https://www.nhd.org/',
    tags: ['Research', 'Creative project'], participation: 'either', challenge: 'either',
  },
  {
    id: 'scholastic-awards',
    title: 'Scholastic Art & Writing Awards',
    organizer: 'Alliance for Young Artists & Writers',
    ageRange: [13, 18], gradeRange: 'Grades 7–12 (age and school enrollment requirements apply)',
    interests: ['Writing & history', 'Art & design'],
    format: 'online',
    summary: 'A national recognition program for original student work across many visual-art and writing categories.',
    matchReason: 'A place to share a piece of writing or art and explore a broad range of creative categories.',
    localGuidance: 'Entries are submitted online; regional affiliates review work and recognition may include regional and national levels.',
    eligibilityNote: 'Eligibility includes grade, age, and enrollment criteria. Review the current rules and region-specific categories before submitting.',
    seasonNote: 'Recurring annual awards cycle; regional deadlines, entry fees, and categories may change.',
    officialUrl: 'https://www.artandwriting.org/',
    tags: ['Creative work', 'Individual entry'], participation: 'solo', challenge: 'either',
  },
  {
    id: 'congressional-app',
    title: 'Congressional App Challenge',
    organizer: 'U.S. House of Representatives',
    ageRange: [13, 18], gradeRange: 'Middle and high school students (district rules apply)',
    interests: ['Coding & technology', 'STEM & robotics', 'Teamwork & creative problem-solving'],
    format: 'online',
    summary: 'Students create an original app or computer program and submit a demonstration for their participating congressional district.',
    matchReason: 'A practical coding project that invites students to build something connected to an idea they care about.',
    localGuidance: 'Submissions are online, but participation depends on a member of Congress opting into the challenge for that district. Check district availability on the official site.',
    eligibilityNote: 'District and student eligibility requirements apply. Review current rules and allowed team sizes before starting.',
    seasonNote: 'Recurring annual challenge; participating districts, deadlines, and rules are set for each cycle.',
    officialUrl: 'https://www.congressionalappchallenge.us/',
    tags: ['App building', 'Project'], participation: 'either', challenge: 'stretch',
  },
  {
    id: 'ecybermission',
    title: 'eCYBERMISSION',
    organizer: 'U.S. Army Educational Outreach Program',
    ageRange: [10, 15], gradeRange: 'Grades 6–9',
    interests: ['STEM & robotics', 'Math & puzzles', 'Teamwork & creative problem-solving'],
    format: 'online',
    summary: 'Student teams use scientific inquiry or engineering design to investigate a community problem and submit a project online.',
    matchReason: 'A guided team project for students who like asking questions and applying STEM to everyday life.',
    localGuidance: 'Teams work on projects and submit online; any program events or supports are described by the organizer.',
    eligibilityNote: 'Grade, team composition, and adult advisor requirements apply. Confirm current eligibility on the official site.',
    seasonNote: 'Recurring annual program; registration windows, awards, and current rules can change.',
    officialUrl: 'https://www.ecybermission.com/',
    tags: ['STEM inquiry', 'Online submission'], participation: 'team', challenge: 'either',
  },
  {
    id: 'destination-imagination',
    title: 'Destination Imagination',
    organizer: 'Destination Imagination',
    ageRange: [6, 18], gradeRange: 'Multiple grade-based program levels',
    interests: ['Teamwork & creative problem-solving', 'Art & design', 'STEM & robotics'],
    format: 'both',
    summary: 'Teams tackle open-ended STEAM challenges that may involve engineering, storytelling, performance, or service learning.',
    matchReason: 'A flexible creative challenge where collaboration and original approaches matter.',
    localGuidance: 'Teams and tournaments are supported by state and regional affiliates. Check the official affiliate directory for local pathways.',
    eligibilityNote: 'Program levels and team rules depend on grade and current challenge rules; teams need an adult team manager.',
    seasonNote: 'Recurring annual challenge cycle; challenge details, local events, costs, and deadlines vary.',
    officialUrl: 'https://www.destinationimagination.org/',
    tags: ['Creative teamwork', 'STEAM'], participation: 'team', challenge: 'either',
  },
  {
    id: 'spelling-bee',
    title: 'Scripps National Spelling Bee',
    organizer: 'The E.W. Scripps Company',
    ageRange: [8, 15], gradeRange: 'Grades 1–8 (participating school and age rules apply)',
    interests: ['Speaking & spelling', 'Writing & history'],
    format: 'both',
    summary: 'A spelling competition pathway that typically begins through an enrolled school or local spelling bee program.',
    matchReason: 'A good fit for word lovers who enjoy learning language and building confidence on stage.',
    localGuidance: 'School and local bee participation depends on organizer enrollment. Use the official participation information to explore the pathway in your area.',
    eligibilityNote: 'Age, grade, school, and prior participation restrictions apply. Check the current handbook and eligibility rules.',
    seasonNote: 'Recurring annual bee; school enrollment, local schedules, and advancement rules can change.',
    officialUrl: 'https://spellingbee.com/',
    tags: ['Words', 'Speaking'], participation: 'solo', challenge: 'stretch',
  },
  {
    id: 'technovation',
    title: 'Technovation Girls',
    organizer: 'Technovation',
    ageRange: [8, 18], gradeRange: 'Program divisions vary by age and region',
    interests: ['Coding & technology', 'STEM & robotics', 'Teamwork & creative problem-solving'],
    format: 'online',
    summary: 'A youth technology entrepreneurship program in which participants identify a problem and develop an app or AI-based solution.',
    matchReason: 'Connects coding with research, design, and pitching a solution to a real-world need.',
    localGuidance: 'Program materials and submissions are online; mentoring and community opportunities depend on the current program cycle.',
    eligibilityNote: 'The organizer’s named program is designed for girls and young women; review current inclusion, age, team, and regional eligibility rules. Everyone can explore the official program details.',
    seasonNote: 'Recurring program cycle; categories, registration, mentorship, and deadlines can change.',
    officialUrl: 'https://technovationchallenge.org/',
    tags: ['Technology', 'Entrepreneurship'], participation: 'team', challenge: 'stretch',
  },
  {
    id: 'usaco',
    title: 'USA Computing Olympiad',
    organizer: 'USA Computing Olympiad',
    ageRange: [12, 18], gradeRange: 'High-school-level programming competition (see current eligibility rules)',
    interests: ['Coding & technology', 'Math & puzzles'],
    format: 'online',
    summary: 'A programming competition with online contests and a progression of increasingly challenging algorithmic problems.',
    matchReason: 'A focused option for someone who enjoys coding puzzles and wants to stretch their problem-solving skills.',
    localGuidance: 'Contests are online. Review the official site for participation, contest format, and current qualification information.',
    eligibilityNote: 'Eligibility and advancement rules are defined by USACO and may depend on age, school status, or other criteria. Confirm before participating.',
    seasonNote: 'Recurring contest seasons; contest windows, rules, and qualification criteria can change.',
    officialUrl: 'https://usaco.org/',
    tags: ['Programming', 'Individual contest'], participation: 'solo', challenge: 'stretch',
  },
];

const interestOptions: { value: Interest; hint: string; Icon: typeof Atom }[] = [
  { value: 'STEM & robotics', hint: 'Build, test, invent', Icon: Atom },
  { value: 'Math & puzzles', hint: 'Patterns and brainteasers', Icon: Brain },
  { value: 'Writing & history', hint: 'Stories, research, ideas', Icon: BookOpen },
  { value: 'Art & design', hint: 'Make things your way', Icon: Palette },
  { value: 'Coding & technology', hint: 'Code and create', Icon: Code2 },
  { value: 'Speaking & spelling', hint: 'Words and presenting', Icon: SpellCheck },
  { value: 'Teamwork & creative problem-solving', hint: 'Solve it together', Icon: Users },
];

const stepCopy = [
  { title: 'How old is your young explorer?', text: 'This helps us surface programs with age and grade guidance that may fit.' },
  { title: 'What sparks their curiosity?', text: 'Choose any that feel right. These are starting points, not labels.' },
  { title: 'How do they like to take part?', text: 'Some programs are built around teams; others make room for individual entries.' },
  { title: 'What kind of challenge sounds fun?', text: 'There is no wrong answer. We will use this as a gentle nudge, not a limit.' },
  { title: 'A little context for the search', text: 'Choose a format and optionally share a city or ZIP to help frame local guidance.' },
];

const quizSteps = 5;
type Participation = 'solo' | 'team' | 'either';
type Challenge = 'steady' | 'balanced' | 'stretch';
type FormatPreference = 'any' | 'in-person' | 'online';

function App() {
  const [step, setStep] = useState(0);
  const [complete, setComplete] = useState(false);
  const [age, setAge] = useState(12);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [participation, setParticipation] = useState<Participation>('either');
  const [challenge, setChallenge] = useState<Challenge>('balanced');
  const [formatPreference, setFormatPreference] = useState<FormatPreference>('any');
  const [location, setLocation] = useState('');
  const [filter, setFilter] = useState<'all' | 'in-person' | 'online'>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const ageEligible = useMemo(() => opportunities.filter((op) => age >= op.ageRange[0] && age <= op.ageRange[1]), [age]);
  const scored = useMemo(() => {
    const exact = ageEligible.filter((op) => interests.some((interest) => op.interests.includes(interest)));
    const fallback = exact.length === 0;
    const base = fallback ? ageEligible : exact;
    return base.map((op) => {
      const interestMatches = interests.filter((interest) => op.interests.includes(interest));
      const interestScore = fallback ? 0 : interestMatches.length * 5;
      const preferenceScore = formatPreference === 'any' || op.format === 'both' || op.format === formatPreference ? 2 : 0;
      const participationScore = participation === 'either' || op.participation === 'either' || op.participation === participation ? 1 : 0;
      const challengeScore = challenge === 'balanced' || op.challenge === 'either' ||
        (challenge === 'stretch' && op.challenge === 'stretch') ||
        (challenge === 'steady' && op.challenge === 'steady') ? 1 : 0;
      const reason = fallback
        ? `A popular starting point for ages ${op.ageRange[0]}–${op.ageRange[1]}; explore its format and eligibility to see if it feels right.`
        : `Connects with ${interestMatches.join(', ')}${participation !== 'either' && op.participation === participation ? ` and offers a ${participation}-friendly format` : ''}. ${op.matchReason}`;
      return { opportunity: op, score: interestScore + preferenceScore + participationScore + challengeScore, reason, fallback };
    }).sort((a, b) => b.score - a.score || a.opportunity.title.localeCompare(b.opportunity.title));
  }, [ageEligible, interests, formatPreference, participation, challenge]);

  const filtered = useMemo(() => scored.filter(({ opportunity: op }) => {
    const matchesFilter = filter === 'all' || op.format === 'both' || op.format === filter;
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [op.title, op.organizer, op.summary, op.interests.join(' '), op.tags?.join(' ')].join(' ').toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  }), [scored, filter, search]);

  const toggleInterest = (interest: Interest) => {
    setInterests((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  };
  const next = () => {
    if (step < quizSteps - 1) {
      setStep((current) => current + 1);
      setAnnouncement(`Step ${step + 2} of ${quizSteps}: ${stepCopy[step + 1].title}`);
    } else {
      setComplete(true);
      setStep(quizSteps);
      setAnnouncement(`Your recommendations are ready. ${scored.length} opportunities to explore.`);
      window.setTimeout(() => document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };
  const back = () => {
    setStep((current) => Math.max(0, current - 1));
    setAnnouncement(`Step ${Math.max(step, 1)} of ${quizSteps}`);
  };
  const reset = () => {
    setComplete(false);
    setStep(0);
    setAge(12);
    setInterests([]);
    setParticipation('either');
    setChallenge('balanced');
    setFormatPreference('any');
    setLocation('');
    setFilter('all');
    setSearch('');
    setExpanded(null);
    setAnnouncement('Quiz restarted. Your previous answers have been cleared from this page.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const editAnswers = () => {
    setComplete(false);
    setStep(0);
    setAnnouncement('Edit your answers. Current choices are kept in this browser session only.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="SparkScout home" data-testid="link-brand-home">
          <span className="brand-mark"><Sprout size={20} strokeWidth={2.2} /></span>
          <span className="brand-name">SparkScout</span>
          <span className="brand-tag">find the next thing</span>
        </a>
        <div className="header-note"><ShieldCheck size={15} /><span>Your answers stay on this page</span></div>
      </header>
      <main className="page-wrap">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">A little curiosity goes a long way</div>
            <h1 id="hero-title">Find a place for<br />that bright spark.</h1>
            <p>Tell us what a young person enjoys. We’ll point you toward recurring programs and competitions to explore together.</p>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>Made for<br />what’s next</span></div>
        </section>

        {!complete && <section className="quiz-panel" aria-labelledby="quiz-title">
          <div className="panel-head">
            <div>
              <div className="step-kicker">Your quick-start guide</div>
              <h2 id="quiz-title">{stepCopy[step]?.title}</h2>
              <p>{stepCopy[step]?.text}</p>
            </div>
            <div className="step-count" aria-label={`Step ${step + 1} of ${quizSteps}`}>0{step + 1} <span>/ 0{quizSteps}</span></div>
          </div>
          <div className="progress-track" aria-label={`Quiz progress: ${Math.round(((step + 1) / quizSteps) * 100)} percent`}>
            <div className="progress-fill" style={{ width: `${((step + 1) / quizSteps) * 100}%` }} />
          </div>

          {step === 0 && <div>
            <label className="field-label" htmlFor="age-range">Age (6–18)</label>
            <div className="age-row">
              <div className="age-number" aria-live="polite" data-testid="text-selected-age">{age}</div>
              <div className="age-control">
                <span className="age-bound">6</span>
                <input id="age-range" type="range" min="6" max="18" value={age} onChange={(event) => setAge(Number(event.target.value))} aria-label="Age, from 6 to 18" data-testid="input-age" />
                <span className="age-bound">18</span>
              </div>
            </div>
            <p className="age-note">We use age as a rough guide. Program grade requirements may differ.</p>
          </div>}

          {step === 1 && <div>
            <div className="field-label" id="interest-label">Pick anything that sounds like them</div>
            <div className="choice-grid interests" role="group" aria-labelledby="interest-label">
              {interestOptions.map(({ value, hint, Icon }) => <button
                type="button" className="choice" key={value} aria-pressed={interests.includes(value)}
                onClick={() => toggleInterest(value)} data-testid={`toggle-interest-${value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}
              >
                <span className="choice-icon"><Icon size={17} /></span>
                <span><strong>{value}</strong><small>{hint}</small></span>
                {interests.includes(value) && <Check size={16} aria-hidden="true" />}
              </button>)}
            </div>
            <p className="privacy-note"><Heart size={13} />You can choose several—or none. We won’t use these to label anyone.</p>
          </div>}

          {step === 2 && <div>
            <div className="field-label" id="participation-label">They might enjoy…</div>
            <div className="choice-grid" role="group" aria-labelledby="participation-label">
              {[
                { id: 'solo' as const, title: 'Doing their own thing', hint: 'Individual projects or contests', Icon: PencilRuler },
                { id: 'team' as const, title: 'Making it happen together', hint: 'A team, club, or shared challenge', Icon: Users },
                { id: 'either' as const, title: 'A bit of both', hint: 'Open to either kind of experience', Icon: Sparkles },
              ].map(({ id, title, hint, Icon }) => <button key={id} type="button" className="choice" aria-pressed={participation === id} onClick={() => setParticipation(id)} data-testid={`select-participation-${id}`}>
                <span className="choice-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{hint}</small></span>
              </button>)}
            </div>
          </div>}

          {step === 3 && <div>
            <div className="field-label" id="challenge-label">A challenge that feels…</div>
            <div className="choice-grid" role="group" aria-labelledby="challenge-label">
              {[
                { id: 'steady' as const, title: 'Comfortably curious', hint: 'Room to learn as they go', Icon: Lightbulb },
                { id: 'balanced' as const, title: 'A good stretch', hint: 'Something new, with support', Icon: Puzzle },
                { id: 'stretch' as const, title: 'Bring on the challenge', hint: 'Ready to dig in and go further', Icon: Wrench },
              ].map(({ id, title, hint, Icon }) => <button key={id} type="button" className="choice" aria-pressed={challenge === id} onClick={() => setChallenge(id)} data-testid={`select-challenge-${id}`}>
                <span className="choice-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{hint}</small></span>
              </button>)}
            </div>
          </div>}

          {step === 4 && <div>
            <div className="field-label" id="format-label">Preferred way to join in</div>
            <div className="choice-grid" role="group" aria-labelledby="format-label">
              {[
                { id: 'any' as const, title: 'Show me a mix', hint: 'Online and in-person', Icon: Sparkles },
                { id: 'in-person' as const, title: 'In person', hint: 'Explore local participation', Icon: MapPin },
                { id: 'online' as const, title: 'Online', hint: 'Join or submit online', Icon: Wifi },
              ].map(({ id, title, hint, Icon }) => <button key={id} type="button" className="choice" aria-pressed={formatPreference === id} onClick={() => setFormatPreference(id)} data-testid={`select-format-${id}`}>
                <span className="choice-icon"><Icon size={17} /></span><span><strong>{title}</strong><small>{hint}</small></span>
              </button>)}
            </div>
            <label className="field-label" htmlFor="location-input" style={{ marginTop: 24 }}>City or ZIP <span style={{ fontWeight: 400, color: '#879188' }}>(optional)</span></label>
            <div className="text-input-wrap">
              <MapPin size={17} />
              <input id="location-input" className="text-input" type="text" maxLength={70} autoComplete="off" value={location} placeholder="For example, 94103 or Austin, TX" onChange={(event) => setLocation(event.target.value)} data-testid="input-location" />
            </div>
            <div className="privacy-note"><LockKeyhole size={13} />Only used on this page to frame local guidance. Never saved or sent anywhere.</div>
          </div>}

          <div className="quiz-actions">
            <button type="button" className="btn btn-quiet" onClick={back} disabled={step === 0} data-testid="button-quiz-back"><ArrowLeft size={15} />Back</button>
            <button type="button" className="btn btn-primary" onClick={next} data-testid={step === quizSteps - 1 ? 'button-show-matches' : 'button-quiz-next'}>
              {step === quizSteps - 1 ? 'See what’s out there' : 'Keep going'}<ArrowRight size={15} />
            </button>
          </div>
        </section>}

        <div role="status" aria-live="polite" className="sr-only" data-testid="status-announcement">{announcement}</div>

        {complete && <section id="recommendations" className="results" aria-labelledby="results-heading">
          <div className="results-top">
            <div>
              <div className="step-kicker">A shortlist to explore{location.trim() ? ` · ${location.trim()}` : ''}</div>
              <div className="results-title"><h2 id="results-heading">A few sparks to follow.</h2><span className="result-count" data-testid="text-result-count">{filtered.length}</span></div>
            </div>
            <button type="button" className="btn btn-quiet" onClick={editAnswers} data-testid="button-edit-answers"><PencilRuler size={15} />Edit answers</button>
          </div>
          <div className="filter-bar" role="group" aria-label="Filter opportunities by format">
            {([
              ['all', 'All opportunities'],
              ['in-person', 'In person'],
              ['online', 'Online'],
            ] as const).map(([key, label]) => <button key={key} type="button" className="filter-chip" aria-pressed={filter === key} onClick={() => { setFilter(key); setAnnouncement(`Showing ${label.toLowerCase()} opportunities.`); }} data-testid={`filter-${key}`}>{label}</button>)}
            <label className="search-box">
              <Search size={15} />
              <span className="sr-only">Search opportunities</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the shortlist" data-testid="input-search-opportunities" />
            </label>
          </div>

          {ageEligible.length === 0 ? <div className="empty-state" data-testid="empty-state-age">
            <div className="empty-icon"><Sprout size={21} /></div>
            <h3>No age-guided suggestions just yet</h3>
            <p>Our recurring-program catalogue doesn’t currently list an age range that includes {age}. Try editing the age to see age-guided suggestions. You can also explore the official program sites linked from any recommendation.</p>
            <button type="button" className="btn btn-quiet" onClick={() => setFilter('all')} data-testid="button-reset-filter">Show all formats</button>
          </div> : filtered.length === 0 ? <div className="empty-state" data-testid="empty-state-search">
            <div className="empty-icon"><Search size={20} /></div>
            <h3>No matches in this view</h3>
            <p>Try a different search or format. There are no live local listings here, just recurring programs to explore.</p>
            <button type="button" className="btn btn-quiet" onClick={() => { setSearch(''); setFilter('all'); }} data-testid="button-clear-search">Clear search and filters</button>
          </div> : <div className="opportunity-grid" aria-live="polite" data-testid="list-recommendations">
            {filtered.map(({ opportunity: op, reason, fallback }) => {
              const open = expanded === op.id;
              return <article className="op-card" key={op.id} data-testid={`card-opportunity-${op.id}`}>
                <div className="card-topline">
                  <div className="organizer">{op.organizer}</div>
                  <span className={`format-pill ${op.format === 'online' ? 'online' : ''}`}>
                    {op.format === 'both' ? <><MapPin size={11} /><Wifi size={11} />Both</> : op.format === 'online' ? <><Laptop size={12} />Online</> : <><MapPin size={11} />In person</>}
                  </span>
                </div>
                <h3>{op.title}</h3>
                <div className="age-meta">{op.ageRange[0]}–{op.ageRange[1]} yrs · {op.gradeRange}</div>
                <p className="op-summary">{op.summary}</p>
                <div className="match-note" data-testid={`reason-match-${op.id}`}><strong>{fallback ? 'A popular starting point' : 'Why it surfaced'} </strong>{reason}</div>
                <div className="card-bottom">
                  <div className="tag-list">{op.tags?.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
                  <button type="button" className="details-button" aria-expanded={open} aria-controls={`details-${op.id}`} onClick={() => { setExpanded(open ? null : op.id); setAnnouncement(`${op.title} details ${open ? 'closed' : 'opened'}.`); }} data-testid={`button-details-${op.id}`}>
                    {open ? <>Less <ChevronUp size={14} /></> : <>Details <ChevronDown size={14} /></>}
                  </button>
                </div>
                {open && <div id={`details-${op.id}`} className="detail-panel" data-testid={`details-opportunity-${op.id}`}>
                  <p className="detail-row"><strong>{op.format === 'online' ? 'How to take part' : 'How local participation works'}</strong><br />{op.localGuidance}{location.trim() && op.format !== 'online' ? ` Your location, ${location.trim()}, is not matched to a venue; use the official program page to check local availability.` : ''}</p>
                  <p className="detail-row"><strong>Eligibility</strong><br />{op.eligibilityNote}</p>
                  <p className="detail-row"><strong>Schedule note</strong><br />{op.seasonNote}</p>
                  <a className="official-link" href={op.officialUrl} target="_blank" rel="noreferrer" data-testid={`link-official-${op.id}`}>
                    Official program information <ExternalLink size={13} />
                  </a>
                </div>}
              </article>;
            })}
          </div>}
          {ageEligible.length > 0 && <div className="note-banner" data-testid="notice-program-caveat">
            <ShieldCheck size={17} />
            <div><strong>Recurring programs, not live local listings.</strong> These national opportunities repeat, but this page does not confirm nearby venues, dates, deadlines, or open registration. Schedules and eligibility can change. A parent or guardian should confirm exact grade, local chapter availability, costs, deadlines, supervision, and current rules on each organizer’s official site.</div>
          </div>}
          <div className="results-top" style={{ marginTop: 20 }}>
            <span style={{ color: '#77877d', fontSize: 11 }}>Your answers and location are kept only in temporary page state.</span>
            <button type="button" className="btn btn-quiet" onClick={reset} data-testid="button-restart-quiz"><RotateCcw size={14} />Start over</button>
          </div>
        </section>}

        <p className="footer-note">SparkScout is a starting point for discovery, not an eligibility check. Explore official organizer information with a parent or guardian before making plans.</p>
      </main>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={App} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function RootApp() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default RootApp;
