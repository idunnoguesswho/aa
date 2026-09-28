/* ------------------------------------------------------------------
   Meeting in a Pocket -- grouped reading content for readings.html.
   Hand-maintained to mirror files/Meeting-in-a-Pocket-3x5.docx, but
   organized into the six sections below (rather than one flat list)
   so the reading page can show a table of contents by topic.

   Block types, one object shape each:
     p    = paragraph (newlines render as line breaks -- used for prayers/verses)
     h    = sub-heading
     n    = numbered item            cite = page reference / attribution
     kv   = term + definition (+ optional reference)
     lead = bold lead phrase + text  row  = label + value on one line
   ------------------------------------------------------------------ */
(function () {
  // Small helpers keep the section data below short and readable.
  var P = function (t) { return { type: "p", text: t }; };
  var H = function (t) { return { type: "h", text: t }; };
  var C = function (t) { return { type: "cite", text: t }; };
  var N = function (n, t) { return { type: "n", num: String(n), text: t }; };
  var KV = function (t, d, r) { return { type: "kv", t: t, d: d, r: r || "" }; };
  var L = function (t, d) { return { type: "lead", t: t, d: d }; };
  var R = function (t, d) { return { type: "row", t: t, d: d }; };

  // Turns a plain list of strings into numbered blocks.
  var numbered = function (list) { return list.map(function (t, i) { return N(i + 1, t); }); };

  var STEPS = numbered([
    "We admitted we were powerless over alcohol — that our lives had become unmanageable.",
    "Came to believe that a Power greater than ourselves could restore us to sanity.",
    "Made a decision to turn our will and our lives over to the care of God as we understood Him.",
    "Made a searching and fearless moral inventory of ourselves.",
    "Admitted to God, to ourselves and to another human being the exact nature of our wrongs.",
    "Were entirely ready to have God remove all these defects of character.",
    "Humbly asked Him to remove our shortcomings.",
    "Made a list of all persons we had harmed and became willing to make amends to them all.",
    "Made direct amends to such people wherever possible, except when to do so would injure them or others.",
    "Continued to take personal inventory and when we were wrong promptly admitted it.",
    "Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.",
    "Having had a spiritual awakening as the result of these steps, we tried to carry this message to alcoholics and to practice these principles in all our affairs."
  ]);

  var TRADITIONS = numbered([
    "Our common welfare should come first; personal recovery depends upon A.A. unity.",
    "For our group purpose there is but one ultimate authority — a loving God as He may express Himself in our group conscience. Our leaders are but trusted servants; they do not govern.",
    "The only requirement for A.A. membership is a desire to stop drinking.",
    "Each group should be autonomous except in matters affecting other groups or A.A. as a whole.",
    "Each group has but one primary purpose — to carry its message to the alcoholic who still suffers.",
    "An A.A. group ought never endorse, finance, or lend the A.A. name to any related facility or outside enterprise, lest problems of money, property, and prestige divert us from our primary purpose.",
    "Every A.A. group ought to be fully self-supporting, declining outside contributions.",
    "Alcoholics Anonymous should remain forever non-professional, but our service centers may employ special workers.",
    "A.A., as such, ought never be organized; but we may create service boards or committees directly responsible to those they serve.",
    "Alcoholics Anonymous has no opinion on outside issues; hence the A.A. name ought never be drawn into public controversy.",
    "Our public relations policy is based on attraction rather than promotion; we need always maintain personal anonymity at the level of press, radio, and films.",
    "Anonymity is the spiritual foundation of all our traditions, ever reminding us to place principles before personalities."
  ]);

  var GROUPS = [
    /* ---------------- At the meeting ---------------- */
    { id: "meeting", label: "At the meeting", sections: [
      { id: "preamble", title: "The A.A. Preamble", blocks: [
        P("Alcoholics Anonymous is a fellowship of men and women who share their experience, strength and hope with each other that they may solve their common problem and help others to recover from alcoholism."),
        P("The only requirement for membership is a desire to stop drinking. There are no dues or fees for A.A. membership; we are self-supporting through our own contributions."),
        P("A.A. is not allied with any sect, denomination, politics, organization or institution; does not wish to engage in any controversy; neither endorses nor opposes any causes."),
        P("Our primary purpose is to stay sober and help other alcoholics to achieve sobriety.")
      ]},
      { id: "serenity", title: "Serenity Prayer", blocks: [
        P("God grant me the serenity to accept the things I cannot change;\nthe courage to change the things I can;\nand the wisdom to know the difference.")
      ]},
      { id: "hiw", title: "How It Works", blocks: [
        P("Rarely have we seen a person fail who has thoroughly followed our path. Those who do not recover are people who cannot or will not completely give themselves to this simple program, usually men and women who are constitutionally incapable of being honest with themselves."),
        P("There are such unfortunates. They are not at fault; they seem to have been born that way. They are naturally incapable of grasping and developing a manner of living which demands rigorous honesty. Their chances are less than average. There are those, too, who suffer from grave emotional and mental disorders, but many of them do recover if they have the capacity to be honest."),
        P("Our stories disclose in a general way what we used to be like, what happened, and what we are like now. If you have decided you want what we have and are willing to go to any length to get it — then you are ready to take certain steps."),
        P("At some of these we balked. We thought we could find an easier, softer way. But we could not. With all the earnestness at our command, we beg of you to be fearless and thorough from the very start. Some of us have tried to hold on to our old ideas and the result was nil until we let go absolutely."),
        P("Remember that we deal with alcohol — cunning, baffling, powerful! Without help it is too much for us. But there is One who has all power — that One is God. May you find Him now!"),
        P("Half measures availed us nothing. We stood at the turning point. We asked His protection and care with complete abandon."),
        P("Here are the steps we took, which are suggested as a program of recovery:")
      ].concat(STEPS).concat([
        P("Many of us exclaimed, “What an order! I can’t go through with it.”"),
        P("Do not be discouraged. No one among us has been able to maintain anything like perfect adherence to these principles. We are not saints. The point is that we are willing to grow along spiritual lines. The principles we have set down are guides to progress. We claim spiritual progress rather than spiritual perfection."),
        P("Our description of the alcoholic, the chapter to the agnostic, and our personal adventures before and after make clear three pertinent ideas:"),
        N("a", "That we were alcoholic and could not manage our own lives."),
        N("b", "That probably no human power could have relieved our alcoholism."),
        N("c", "That God could and would if He were sought.")
      ])},
      { id: "steps", title: "The Twelve Steps", blocks: STEPS },
      { id: "traditions", title: "The Twelve Traditions", blocks: TRADITIONS },
      { id: "promises", title: "The Promises", blocks: [
        P("If we are painstaking about this phase of our development, we will be amazed before we are halfway through. We are going to know a new freedom and a new happiness. We will not regret the past nor wish to shut the door on it. We will comprehend the word serenity and we will know peace. No matter how far down the scale we have gone, we will see how our experience can benefit others. The feeling of uselessness and self-pity will disappear. We will lose interest in selfish things and gain interest in our fellows. Self-seeking will slip away. Our whole attitude and outlook upon life will change. Fear of people and of economic insecurity will leave us. We will intuitively know how to handle situations which used to baffle us. We will suddenly realize that God is doing for us what we could not do for ourselves."),
        P("Are these extravagant promises? We think not. They are being fulfilled among us — sometimes quickly, sometimes slowly. They will always materialize if we work for them.")
      ]},
      { id: "vision", title: "A Vision for You", blocks: [
        P("Our book is meant to be suggestive only. We realize we know only a little. God will constantly disclose more to you and to us. Ask Him in your morning meditation what you can do each day for the man who is still sick. The answers will come, if your own house is in order."),
        P("But obviously you cannot transmit something you haven’t got. See to it that your relationship with Him is right, and great events will come to pass for you and countless others. This is the Great Fact for us."),
        P("Abandon yourself to God as you understand God. Admit your faults to Him and to your fellows. Clear away the wreckage of your past. Give freely of what you find and join us. We shall be with you in the Fellowship of the Spirit, and you will surely meet some of us as you trudge the Road of Happy Destiny."),
        P("May God bless you and keep you until then.")
      ]},
      { id: "pledge", title: "Responsibility Pledge", blocks: [
        P("I am responsible. When anyone, anywhere reaches out for help, I want the hand of A.A. always to be there. And for that, I am responsible!")
      ]},
      { id: "topics", title: "ABCs of Meeting Topics", blocks: [
        KV("A", "Acceptance, Amends, Anonymity"),
        KV("B", "Behavior, Belonging, Blackouts"),
        KV("C", "Conscience, Complacency, Complex"),
        KV("D", "Desire, Decisions, Depression"),
        KV("E", "Easy-Does-It, Emotions, Egos"),
        KV("F", "Faith, Fear, Fellowship, Fatigue"),
        KV("G", "Gratitude, Gossip, Guilt, Grace"),
        KV("H", "Humility, Hope, Honesty, Happiness"),
        KV("I", "Inferiority, Illness, Immaturity, Inside"),
        KV("J", "Jealousy, Joy, Judging"),
        KV("K", "Kindness, Knowledge"),
        KV("L", "Love, Loneliness, Live-and-Let-Live"),
        KV("M", "Meetings, Morals, Meditation"),
        KV("N", "New Life, Ninth Step, Newcomers"),
        KV("O", "Obligations, One Day at a Time"),
        KV("P", "Prayer, Personalities, Principles"),
        KV("Q", "Quality vs. Quantity, Quiet Time"),
        KV("R", "Resentments, Recovery, Remorse"),
        KV("S", "Surrender, Serenity, Spirituality"),
        KV("T", "Temper, Tolerance, Truth, Today"),
        KV("U", "Unselfish, Unity, Understanding"),
        KV("V", "Vanity, Values, Virtues, Vulgarity"),
        KV("W", "Worry, Way of Life, Willingness"),
        KV("X Y Z", "Yesterday, Youth, Zest for Sobriety")
      ]}
    ]},

    /* ---------------- Prayers ---------------- */
    { id: "prayers", label: "Prayers", sections: [
      { id: "stepprayers", title: "12 Step Prayers", blocks: [
        H("Step 1"), C("p. 46"),
        P("God, Creative Intelligence, Universal Mind, Spirit of Nature or Spirit of the Universe, my name is ______, and I’m a real alcoholic… and I need your help today."),
        H("Step 2"), C("p. 59"),
        P("God, I’m standing at the turning point right now. Give me your protection and care as I abandon myself to you and give up my old ways and my old ideas just for today."),
        H("Step 3"), C("p. 63"),
        P("God, I offer myself to Thee — to build with me and to do with me as Thou wilt. Relieve me of the bondage of self, that I may better do Thy will. Take away my difficulties, that victory over them may bear witness to those I would help of Thy Power, Thy Love, and Thy Way of life. May I do Thy will always!"),
        P("God, take my will and my life. Guide me in my recovery. Show me how to live."), C("p. 59"),
        H("Step 4 — When in doubt"), C("p. 13"),
        P("“I was to sit quietly when in doubt, asking only for direction and strength to meet my problems as He would have me. Never was I to pray for myself, except as my requests bore on my usefulness to others. Then only might I expect to receive. But that would be in great measure.”"),
        H("Step 4 — When disturbed by the conduct of others"), C("p. 67"),
        P("This is a sick man. How can I be helpful to him? God save me from being angry. Thy will be done."),
        P("God help me to show this person the same tolerance, pity and patience that I would cheerfully grant a sick friend. This is a sick person, how can I be helpful to him? God save me from being angry. Thy will be done."), C("See also p. 141 of the 12&12"),
        H("Step 4 — When afraid"), C("p. 68"),
        P("God, relieve me of this fear and direct my attention to what you would have me be."),
        H("Step 5"), C("p. 75"),
        P("God, I thank you from the bottom of my heart that I know you better. Help me become aware of anything I have omitted discussing with another person. Help me to do what is necessary to walk a free man at last."),
        H("Step 6"), C("p. 76"),
        P("God help me become willing to let go of all the things to which I still cling. Help me to be ready to let You remove all of these defects, that Your will and purpose may take their place."),
        H("Step 7"), C("p. 76"),
        P("My Creator, I am now willing that you should have all of me, good and bad. I pray that you now remove from me every single defect of character which stands in the way of my usefulness to you and my fellows. Grant me strength, as I go out from here, to do your bidding."),
        H("Step 8"), C("p. 76"),
        P("God help me to become willing to sweep away the debris of self-will and self-reliant living. Thy will be done for this person as well as for me."),
        H("Step 9"), C("pp. 78–80"),
        P("God give me the strength and direction to do the right thing no matter what the consequences may be. Help me to consider others and not harm them in any way. Help me to consult with others before I take any actions that would cause me to be sorry. Help me to not repeat such behaviors. Show me the way of Patience, Tolerance, Kindliness, and Love and help me live the spiritual life."),
        H("Step 10"), C("pp. 84–85"),
        P("God remove the selfishness, dishonesty, resentment, and fear that has cropped up in my life right now. Help me to discuss this with someone immediately and make amends quickly if I have harmed anyone. Help me to cease fighting anything and anyone. Show me where I may be helpful to someone else. Help me react sanely; not cocky or afraid. How can I best serve You — Your will, not mine, be done."),
        P("How can I best serve Thee — Thy will (not mine) be done."), C("p. 85"),
        H("Step 11"), C("pp. 87–88"),
        P("God, I’m agitated and doubtful right now. Help me to stop and remember that I’ve made a decision to let You be my God. Give me the right thoughts and actions. God save me from fear, anger, worry, self-pity, or foolish decisions — that Your will, not mine, be done."),
        H("Step 12"), C("p. 89"),
        P("Dear God, having had a spiritual experience, I must now remember that “faith without works is dead.” And practical experience shows that nothing will so much insure immunity from drinking as intensive work with other alcoholics. So, God, please help me to carry this message to other alcoholics! Provide me with the guidance and wisdom to talk with another alcoholic because I can help when no one else can. Help me secure his confidence and remember he is ill.")
      ]},
      { id: "francis", title: "Prayer of Saint Francis", blocks: [
        P("Lord, make me a channel of thy peace."),
        P("That where there is hatred, I may bring love;\nthat where there is wrong, I may bring the spirit of forgiveness;\nthat where there is discord, I may bring harmony;\nthat where there is error, I may bring truth;\nthat where there is doubt, I may bring faith;\nthat where there is despair, I may bring hope;\nthat where there are shadows, I may bring light;\nthat where there is sadness, I may bring joy."),
        P("Lord, grant that I may seek rather\nto comfort than to be comforted;\nto understand, than to be understood;\nto love, than to be loved."),
        P("For it is by self-forgetting that one finds;\nit is by forgiving that one is forgiven;\nit is by dying that one awakens to Eternal Life.")
      ]},
      { id: "gratitude", title: "Gratitude", blocks: [
        P("Thank you (Higher Power),\nfor all that You have given,\nfor all that You have taken,\nand for all that You have left me.")
      ]},
      { id: "thywill", title: "Thy Will Be Done", blocks: [
        P("As we go through the day we pause, when agitated or doubtful, and ask for the right thought or action. We constantly remind ourselves we are no longer running the show, humbly saying to ourselves many times each day “Thy will be done.” We are then in much less danger of excitement, fear, anger, worry, self-pity, or foolish decisions. We become much more efficient. We do not tire so easily, for we are not burning up energy foolishly as we did when we were trying to arrange life to suit ourselves."),
        C("Alcoholics Anonymous, p. 88")
      ]},
      { id: "resentment", title: "Resentment Prayer", blocks: [
        P("This was our course: We realized that the people who wronged us were perhaps spiritually sick. Though we did not like their symptoms and the way these disturbed us, they, like ourselves, were sick too. We asked God to help us show them the same tolerance, pity and patience that we would cheerfully grant a sick friend. When a person offended, we said to ourselves, “This is a sick man. How can we be helpful to him? God save me from being angry. Thy will be done.”"),
        C("Alcoholics Anonymous, pp. 66–67")
      ]},
      { id: "lords", title: "The Lord’s Prayer", blocks: [
        P("Our Father, who art in heaven, hallowed be thy name.\nThy kingdom come, thy will be done, on earth as it is in heaven.\nGive us this day our daily bread,\nand forgive us our trespasses, as we forgive those who trespass against us.\nAnd lead us not into temptation, but deliver us from evil.\nFor thine is the kingdom, and the power, and the glory, forever. Amen.")
      ]}
    ]},

    /* ---------------- Daily practice ---------------- */
    { id: "daily", label: "Daily practice", sections: [
      { id: "staysober", title: "To Stay Sober", blocks: numbered([
        "Don’t drink.", "Go to meetings.", "Read the Big Book.", "Get a sponsor.", "Work the Steps.", "Help another alcoholic."
      ])},
      { id: "justtoday", title: "Just for Today", blocks: [
        L("Just for today", "I will try to live through this day only, and not tackle my whole life problems at once. I can do something for twelve hours that would appall me if I felt that I had to keep it up for a lifetime."),
        L("Just for today", "I will be happy. This assumes to be true what Abraham Lincoln said, that “most folks are as happy as they make up their minds to be.”"),
        L("Just for today", "I will adjust myself to what is, and not try to adjust everything to my own desires. I will take my “luck” as it comes, and fit myself to it."),
        L("Just for today", "I will try to strengthen my mind. I will study. I will learn something useful. I will not be a mental loafer. I will read something that requires effort, thought and concentration."),
        L("Just for today", "I will exercise my soul in three ways: I will do somebody a good turn, and not get found out; if anybody knows of it, it will not count. I will do at least two things I don’t want to do — just for exercise. I will not show anyone that my feelings are hurt: they may be hurt, but today I will not show it.")
      ]},
      { id: "goodday", title: "How to Have a Good Day", blocks: [
        L("Take time to laugh:", "it is the music of the soul."),
        L("Take time to think:", "it is the source of all power."),
        L("Take time to play:", "it is the source of perpetual youth."),
        L("Take time to read:", "it is the fountain of wisdom."),
        L("Take time to pray:", "it is the greatest power on Earth."),
        L("Take time to love and be loved:", "it is a God-given privilege."),
        L("Take time to be friendly:", "it is the road to happiness."),
        L("Take time to give:", "it is too short a day to be selfish."),
        L("Take time to work:", "it is the price of success.")
      ]},
      { id: "tenth", title: "Tenth Step Questions", blocks: numbered([
        "How was I resentful?",
        "How was I selfish, egotistical, or self-seeking?",
        "How was I dishonest?",
        "How was I afraid?",
        "Do I owe an apology?",
        "Have I wrongly kept secret?",
        "Was I unkind, cruel, harsh, or unfeeling?",
        "Was I unloving, cold, or indifferent?",
        "What could I have done better?",
        "Was I thinking of myself most of the time?",
        "Was I thinking of what I could do for others?",
        "Was I thinking what I could pack into the stream of life?"
      ]).concat([
        H("At the end of the day"),
        P("Who did I help today? What did I accomplish today? What am I grateful for today? Who needs my prayers today?")
      ])},
      { id: "absolutes", title: "The Four Absolutes", blocks: [
        KV("Honesty", "Is it true or is it false?"),
        KV("Unselfishness", "How will this affect others?"),
        KV("Love", "Is it ugly or is it beautiful?"),
        KV("Purity", "Is it right or is it wrong?")
      ]},
      { id: "principles", title: "The Twelve Principles", blocks: numbered([
        "Honesty", "Hope", "Surrender", "Courage", "Integrity", "Willingness",
        "Humility", "Love", "Responsibility", "Discipline", "Awareness", "Service"
      ])}
    ]},

    /* ---------------- Reflections ---------------- */
    { id: "reflect", label: "Reflections", sections: [
      { id: "acceptance", title: "Acceptance", blocks: [
        H("A member’s experience"),
        P("Acceptance is the answer to all my problems today. When I am disturbed, it is because I find some person, place, thing, or situation — some fact of my life — unacceptable to me, and I can find no serenity until I accept that person, place, thing, or situation as being exactly the way it is supposed to be at this moment. Nothing, absolutely nothing, happens in God’s world by mistake."),
        C("Alcoholics Anonymous, p. 417")
      ]},
      { id: "humility", title: "Humility", blocks: [
        H("Thought to ponder"),
        P("Humility, as I see it, grows out of an urge to learn from everyone and everything.")
      ]},
      { id: "workwithothers", title: "Carry This Message", blocks: [
        P("Practical experience shows that nothing will so much insure immunity from drinking as intensive work with other alcoholics. It works when other activities fail. This is our twelfth suggestion: Carry this message to other alcoholics! You can help when no one else can. You can secure their confidence when others fail. Remember they are very ill."),
        P("Life will take on new meaning. To watch people recover, to see them help others, to watch loneliness vanish, to have a fellowship grow up about you, to have a host of friends — this is an experience you must not miss. We know you will not want to miss it."),
        C("Alcoholics Anonymous, p. 89")
      ]}
    ]},

    /* ---------------- Big Book index ---------------- */
    { id: "index", label: "Big Book index", sections: [
      { id: "howtouse", title: "How to Use This Index", blocks: [
        P("Three parts: the Twelve Steps with where each is stated and expanded; the Twelve Traditions (short form) with a pointer to the long form; and an alphabetical keyword index. A chapter and appendix page map closes it."),
        P("Page ranges reflect the well-documented structure of the 4th edition (2001), cross-checked against multiple A.A.-community references, not a scan of a physical copy. A few single-page citations for famous passages (the Steps list, the Seventh Step Prayer, “The Promises”) are commonly cited locations — worth a quick spot-check against your own copy. Personal-story pages are not cited individually since that section changes across printings."),
        P("Passages from the book’s narrative text are paraphrased or briefly labeled here, not reproduced at length. The Steps and Traditions are given in full, consistent with A.A. World Services’ long-standing permission for their noncommercial reproduction."),
        C("Keyed to standard 4th-edition (2001) pagination. Compiled September 2026.")
      ]},
      { id: "keywords", title: "Keyword & Subject Index", blocks: [
        KV("Acceptance", "coming to honest terms with alcoholism and reality.", "Chs. 3–5, pp. 30–71; Stories"),
        KV("Agnostics / atheism", "the book’s address to skeptics of a religious Higher Power.", "Ch. 4, pp. 44–57"),
        KV("Alcoholism as illness", "the disease/allergy concept.", "Doctor’s Opinion; Ch. 3, pp. 30–43"),
        KV("Amends, making", "Steps 8–9, listing and repairing harm done.", "Ch. 6, pp. 76–84"),
        KV("Anger", "see Resentment.", ""),
        KV("Anonymity", "protecting identity; principles before personalities.", "Trad. 11–12; App. I, pp. 561–566"),
        KV("Belief / Higher Power", "a power greater than oneself, self-defined.", "Ch. 4, pp. 44–57; Ch. 5, pp. 58–71"),
        KV("Character defects", "shortcomings addressed in Steps 6–7.", "Ch. 6, pp. 75–76"),
        KV("Compulsion of mind", "the obsession preceding the first drink.", "Ch. 3, pp. 30–43"),
        KV("Craving, phenomenon of", "physical reaction following the first drink.", "Doctor’s Opinion; Ch. 3, pp. 30–43"),
        KV("Denial", "resisting the seriousness of one’s drinking.", "Ch. 3, pp. 30–43"),
        KV("Dishonesty", "an obstacle named from the outset.", "Ch. 5, p. 58; Ch. 6, pp. 64–71"),
        KV("Ego / self-centeredness", "named as the root of most troubles.", "Ch. 5, p. 62"),
        KV("Employers, relations with", "guidance for and about alcoholic employees.", "Ch. 10, pp. 136–150"),
        KV("Faith", "distinct from religious doctrine.", "Ch. 4, pp. 44–57"),
        KV("Family relationships", "rebuilding home life in recovery.", "Ch. 8, pp. 104–121; Ch. 9, pp. 122–135"),
        KV("Fear", "Step 4 inventory of self-created fears.", "Ch. 6, pp. 67–68"),
        KV("Fellowship", "alcoholics helping alcoholics.", "Ch. 2, pp. 17–29"),
        KV("Financial insecurity", "addressed in the inventory instructions.", "Ch. 6, pp. 64–71"),
        KV("Forgiveness", "implicit in the amends process.", "Ch. 6, pp. 76–84"),
        KV("God, as we understood Him", "the program’s individualized language.", "Steps 3, 11; p. 63; pp. 85–88"),
        KV("Gratitude", "a recurring theme of long sobriety.", "Personal Stories I–III"),
        KV("Group conscience", "the group’s collective authority.", "Trad. 2; App. I, pp. 561–566"),
        KV("Half measures", "warning that partial effort “availed us nothing.”", "Ch. 5, p. 59"),
        KV("Honesty", "framed as essential from Ch. 5 onward.", "Ch. 5, p. 58; Ch. 6, pp. 64–71"),
        KV("Humility", "central to Steps 6, 7, 12; sponsorship.", "Ch. 6, pp. 75–76; Ch. 7, pp. 89–103"),
        KV("Inventory, moral (4th Step)", "self-examination of resentments, fears, conduct.", "Ch. 6, pp. 64–71"),
        KV("Isolation", "loneliness in drinking and recovery.", "Ch. 2, pp. 17–29"),
        KV("Meditation", "part of Step 11 practice.", "Ch. 6, pp. 85–88"),
        KV("Membership requirements", "the sole requirement for A.A. membership.", "Trad. 3; App. I, pp. 561–566"),
        KV("Newcomers, working with", "Step 12 practice of carrying the message.", "Ch. 7, pp. 89–103"),
        KV("Powerlessness", "the admission at the heart of Step 1.", "Ch. 3, pp. 30–43; Ch. 5, pp. 58–60"),
        KV("Prayer", "Third, Seventh, Eleventh Step prayers.", "pp. 63, 76, 85–88"),
        KV("Pride", "an obstacle in working with others.", "Ch. 7, pp. 89–103"),
        KV("Promises, The", "changes to expect “if we are painstaking.”", "Ch. 6, pp. 83–84"),
        KV("Public relations policy", "attraction rather than promotion.", "Trad. 11; App. I, pp. 561–566"),
        KV("Rationalization", "the mind’s justification for drinking.", "Ch. 3, pp. 30–43"),
        KV("Relapse / slips", "risk of, and recovery from, a return to drinking.", "Ch. 3, pp. 30–43; Stories"),
        KV("Religion, relationship to", "distinguished from any specific doctrine.", "Ch. 4, pp. 44–57; App. V, p. 572"),
        KV("Resentment", "named “the number one” offender.", "Ch. 6, p. 64"),
        KV("Rock bottom", "the point of surrender in personal accounts.", "Personal Stories I–III"),
        KV("Self-supporting (finances)", "declining outside contributions.", "Trad. 7; App. I, pp. 561–566"),
        KV("Sex conduct, inventory of", "examining past and future conduct.", "Ch. 6, pp. 68–70"),
        KV("Sobriety, maintaining", "day-to-day practice of the program.", "Ch. 6, pp. 72–88"),
        KV("Sponsorship", "one alcoholic guiding another.", "Ch. 7, pp. 89–103"),
        KV("Spiritual awakening", "the result described in Step 12.", "Ch. 6, pp. 83–84; App. II, pp. 567–568"),
        KV("Spiritual experience", "awakenings are often gradual, not sudden.", "App. II, pp. 567–568"),
        KV("Surrender", "the decision at the heart of Step 3.", "Ch. 5, p. 63"),
        KV("Tolerance", "urged especially toward family early on.", "Ch. 9, pp. 122–135"),
        KV("Twelve Concepts", "A.A.’s service-structure principles.", "App. VII, pp. 574–575"),
        KV("Unity", "the Fellowship’s first concern.", "Trad. 1; App. I, pp. 561–566"),
        KV("Unmanageability", "the second half of the Step 1 admission.", "Ch. 3, pp. 30–43; Ch. 5, pp. 58–60"),
        KV("Willingness", "the disposition required for Step 6.", "Ch. 6, p. 75"),
        KV("Wives, message to", "a chapter addressed to spouses.", "Ch. 8, pp. 104–121"),
        KV("Women alcoholics", "acknowledged in the Fellowship’s growth.", "Foreword to 2nd Ed., pp. xv–xxi")
      ]},
      { id: "chapters", title: "Chapter & Appendix Map", blocks: [
        C("4th edition (2001) pagination"),
        R("Doctor’s Opinion", "pp. xxv–xxxii"),
        R("1. Bill’s Story", "pp. 1–16"),
        R("2. There Is a Solution", "pp. 17–29"),
        R("3. More About Alcoholism", "pp. 30–43"),
        R("4. We Agnostics", "pp. 44–57"),
        R("5. How It Works", "pp. 58–71"),
        R("6. Into Action", "pp. 72–88"),
        R("7. Working With Others", "pp. 89–103"),
        R("8. To Wives", "pp. 104–121"),
        R("9. The Family Afterward", "pp. 122–135"),
        R("10. To Employers", "pp. 136–150"),
        R("11. A Vision For You", "pp. 151–164"),
        R("Personal Stories I–III", "pp. 165–559 (varies)"),
        R("App. I — A.A. Tradition (long form)", "pp. 561–566"),
        R("App. II — Spiritual Experience", "pp. 567–568"),
        R("App. III — Medical View", "pp. 569–570"),
        R("App. IV — The Lasker Award", "p. 571"),
        R("App. V — Religious View", "p. 572"),
        R("App. VI — Contact A.A.", "p. 573"),
        R("App. VII — Twelve Concepts", "pp. 574–575")
      ]}
    ]},

    /* ---------------- Names & numbers ---------------- */
    { id: "contacts", label: "Names & numbers", sections: [
      // Special-cased in readings.js: rendered as an editable, this-device-only
      // notes box (see notesBox()) instead of the blocks below, which are only
      // a fallback for anything that reads this file without that renderer.
      { id: "names", title: "Names & Numbers", notes: true, blocks: [
        P("Your sponsor, home group and phone list go here — kept private, saved only on this device, never sent anywhere.")
      ]}
    ]}
  ];

  // Expose one read-only object for readings.js.
  window.AA_CONTENT = {
    signOffUrl: "signoff.html",
    tagline: "Pray daily — God is easier to talk to than most people.",
    disclaimer: "This Meeting in a Pocket is not affiliated with Alcoholics Anonymous World Services, Inc., or with the General Service Office of Alcoholics Anonymous. The publication of this booklet has not been authorized or endorsed by, and does not imply affiliation with Alcoholics Anonymous World Services, Inc., or with the General Service Office of Alcoholics Anonymous. Permission is granted to reproduce all or part of this booklet if it will help get the message to the still-suffering alcoholic.",
    groups: GROUPS
  };
})();
