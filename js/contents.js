const levelOneRule = `
    <strong><h1>NIVEAU 1 - LA RÈGLE DES TIERS</h1></strong>
    <div id="rules-content">
        <p>La règle des tiers a pour objectif de mettre en valeur un élément de la scène 
            en le plaçant sur des lignes imaginaires qui divisent l'image en tiers, 
            verticalement et horizontalement. Les quatre points d'intersection de ces lignes 
            sont des centres d'intérêts particulèrement importants.</p>
    </div>
`;

const levelOneScenario = `
    <strong><p class="scenario-text">INT/JOUR - APPARTEMENT</p></strong>
    <p class="scenario-text">Bleu regarde Rouge.</p>
    <div id="dialog" class="center">
        <strong><p class="scenario-text">BLEU</p></strong>
        <p class="scenario-text">Salut Rouge !</p>
    </div>
`;

const levelTwoRule = `
    <strong><h1>NIVEAU 2 - LA RÈGLE DES 180 DEGRÉS</h1></strong>
    <div id="rules-content">
        <p>La règle des 180 degrés s'applique lors d'un champ contre champ. 
            Elle consiste à ne jamais dépasser avec la caméra la ligne imaginaire 
            qui relie les deux personnages qui intéragissent. 
            L'objectif est de ne pas perturber le spectateur lors du visionnage 
            et de s'assurer de sa bonne compréhension de la scène</p>
    </div>
`;

const levelTwoScenario = `
    <strong><p class="scenario-text">INT/JOUR - APPARTEMENT</p></strong>
    <div id="dialog" class="center">
        <strong><p class="scenario-text">ROUGE</p></strong>
        <p class="scenario-text">Oh, te voilà Bleu !</p>
    </div>
`;

const levelThreeRule = `
    <strong><h1>NIVEAU 3 - LA RÈGLE DES TRENTE DEGRÉS</h1></strong>
    <div id="rules-content">
        <p>Le principe de la règle des 30 degrés est de ne pas enchaîner 
            deux plans de caméras avec un angle entre le point d'attention et 
            les deux positions des caméras de moins de 30 degrés. 
            Si cette règle est enfreinte, cela donne au spectateur 
            une impression de saut d'un plan à l'autre.</p>
    </div>
`;

const levelThreeScenario = `
    <strong><p class="scenario-text">INT/JOUR - APPARTEMENT</p></strong>
    <p class="scenario-text">Rouge est très heureux.</p>
    <div id="dialog" class="center">
        <strong><p class="scenario-text">ROUGE</p></strong>
        <p class="scenario-text">Ça faisait longtemps !</p>
    </div>
`;

const levelsContent = [
    {
        rule: levelOneRule,
        scenario: levelOneScenario
    },
    {
        rule: levelTwoRule,
        scenario: levelTwoScenario
    },
    {
        rule: levelThreeRule,
        scenario: levelThreeScenario
    }
];

export { levelsContent }