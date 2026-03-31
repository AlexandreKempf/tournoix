
import type {Match, Team} from '$lib/components/schemas.ts';

function lessRefereedTeam(candidates: string[], matches: Match[]): string {
    const counts = matches.map(m => m.referee).reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
        }, {});
	let referee = candidates.toSorted((a,b) => (counts[a] || 0) - (counts[b] || 0))[0]
	return referee
}

function Round1(teams: Team[]) {
	return [
		{teamA: teams[0].name, teamB: teams[1].name, referee: teams[4].name, court: 0, phase: 'swiss1'},
		{teamA: teams[2].name, teamB: teams[3].name, referee: teams[6].name, court: 1, phase: 'swiss1'},
		{teamA: teams[4].name, teamB: teams[5].name, referee: teams[8].name, court: 0, phase: 'swiss1'},
		{teamA: teams[6].name, teamB: teams[7].name, referee: teams[10].name, court: 1, phase: 'swiss1'},
		{teamA: teams[8].name, teamB: teams[9].name, referee: teams[0].name, court: 0, phase: 'swiss1'},
		{teamA: teams[10].name, teamB: teams[11].name, referee: teams[2].name, court: 1, phase: 'swiss1'},
	]
}

function Round2(teams: Team[], matches: Match[]) {
    let winners = matches.map(m => m.scoreA > m.scoreB ? m.teamA : m.teamB)
    let losers = matches.map(m => m.scoreA > m.scoreB ? m.teamB : m.teamA)
    let new_matches = []
    new_matches.push({teamA: winners[0], teamB: winners[1], referee: lessRefereedTeam([winners[2], winners[3], winners[4], winners[5]], matches), court: 0, phase: 'swiss2', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[2], teamB: winners[3], referee: lessRefereedTeam([winners[0], winners[1], winners[4], winners[5]], [...matches,...new_matches]), court: 0, phase: 'swiss2', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[4], teamB: winners[5], referee: lessRefereedTeam([winners[2], winners[3], winners[0], winners[1]], [...matches,...new_matches]), court: 0, phase: 'swiss2', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[0], teamB: losers[1], referee: lessRefereedTeam([losers[2], losers[3], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'swiss2', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[2], teamB: losers[3], referee: lessRefereedTeam([losers[0], losers[1], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'swiss2', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[4], teamB: losers[5], referee: lessRefereedTeam([losers[2], losers[3], losers[0], losers[1]], [...matches,...new_matches]), court: 1, phase: 'swiss2', scoreA: 0, scoreB: 0})
    return new_matches
}
    
function Round3(teams: Team[], matches: Match[]) {
    let wins = matches.map(m => m.scoreA > m.scoreB ? m.teamA : m.teamB).reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
    }, {})
    let playingTeams = teams.filter(t => wins[t.name] === 1).map(t=>t.name)
    let there_is_rematch = true
    let shift = 0
    let new_matches: Match[] = []
    while (there_is_rematch) {
        let candidates = []
        candidates.push({teamA: playingTeams[(shift+0)%6], teamB: playingTeams[(shift+1)%6], referee: playingTeams[(shift+4)%6], court: 0, phase: 'swiss3', scoreA: 0, scoreB: 0})
        candidates.push({teamA: playingTeams[(shift+2)%6], teamB: playingTeams[(shift+3)%6], referee: playingTeams[(shift+5)%6], court: 1, phase: 'swiss3', scoreA: 0, scoreB: 0})
        candidates.push({teamA: playingTeams[(shift+4)%6], teamB: playingTeams[(shift+5)%6], referee: lessRefereedTeam([playingTeams[(shift+0)%6], playingTeams[(shift+1)%6]], [...matches,...candidates]), court: 0, phase: 'swiss3', scoreA: 0, scoreB: 0})
        let opponents_played = matches.map(m => m.teamA > m.teamB ? m.teamA + m.teamB : m.teamB + m.teamA)    
        let opponents_to_play = candidates.map(m => m.teamA > m.teamB ? m.teamA + m.teamB : m.teamB + m.teamA) 
        if (opponents_to_play.filter(opp => opponents_played.includes(opp)).length > 0){
            shift = shift+1
        }
        else {
            there_is_rematch = false
            new_matches = candidates
        }
    }
    return new_matches
}

function Bracket(teams: Team[], matches: Match[]) {
    let wins = matches.filter(m => ['swiss1', 'swiss2', 'swiss3'].includes(m.phase)).map(m => m.scoreA > m.scoreB ? m.teamA : m.teamB).reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
    }, {})
    let loses = matches.filter(m => ['swiss1', 'swiss2', 'swiss3'].includes(m.phase)).map(m => m.scoreA < m.scoreB ? m.teamA : m.teamB).reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
    }, {})
    let winners = teams.filter(t => wins[t.name] >=2).map(t=>t.name)
    let losers = teams.filter(t => loses[t.name] >=2).map(t=>t.name)
    let new_matches = []
    new_matches.push({teamA: winners[0], teamB: winners[1], referee: lessRefereedTeam([winners[2], winners[3], winners[4], winners[5]], matches), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[2], teamB: winners[3], referee: lessRefereedTeam([winners[0], winners[1], winners[4], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[4], teamB: winners[5], referee: lessRefereedTeam([winners[2], winners[3], winners[0], winners[1]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[0], teamB: winners[2], referee: lessRefereedTeam([winners[1], winners[3], winners[4], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[1], teamB: winners[4], referee: lessRefereedTeam([winners[0], winners[2], winners[3], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[3], teamB: winners[5], referee: lessRefereedTeam([winners[2], winners[4], winners[0], winners[1]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[2], teamB: winners[4], referee: lessRefereedTeam([winners[5], winners[3], winners[0], winners[1]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[0], teamB: winners[3], referee: lessRefereedTeam([winners[2], winners[1], winners[4], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[1], teamB: winners[5], referee: lessRefereedTeam([winners[0], winners[2], winners[4], winners[3]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[0], teamB: winners[4], referee: lessRefereedTeam([winners[2], winners[3], winners[1], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[2], teamB: winners[5], referee: lessRefereedTeam([winners[4], winners[3], winners[0], winners[1]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[1], teamB: winners[3], referee: lessRefereedTeam([winners[0], winners[2], winners[4], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[0], teamB: winners[5], referee: lessRefereedTeam([winners[2], winners[3], winners[4], winners[1]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[4], teamB: winners[3], referee: lessRefereedTeam([winners[0], winners[1], winners[2], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: winners[2], teamB: winners[1], referee: lessRefereedTeam([winners[0], winners[3], winners[4], winners[5]], [...matches,...new_matches]), court: 0, phase: 'bracket', scoreA: 0, scoreB: 0})

    new_matches.push({teamA: losers[0], teamB: losers[1], referee: lessRefereedTeam([losers[2], losers[3], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[2], teamB: losers[3], referee: lessRefereedTeam([losers[0], losers[1], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[4], teamB: losers[5], referee: lessRefereedTeam([losers[2], losers[3], losers[0], losers[1]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[0], teamB: losers[2], referee: lessRefereedTeam([losers[1], losers[3], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[1], teamB: losers[4], referee: lessRefereedTeam([losers[0], losers[2], losers[3], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[3], teamB: losers[5], referee: lessRefereedTeam([losers[2], losers[4], losers[0], losers[1]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[2], teamB: losers[4], referee: lessRefereedTeam([losers[5], losers[3], losers[0], losers[1]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[0], teamB: losers[3], referee: lessRefereedTeam([losers[2], losers[1], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[1], teamB: losers[5], referee: lessRefereedTeam([losers[0], losers[2], losers[4], losers[3]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[0], teamB: losers[4], referee: lessRefereedTeam([losers[2], losers[3], losers[1], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[2], teamB: losers[5], referee: lessRefereedTeam([losers[4], losers[3], losers[0], losers[1]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[1], teamB: losers[3], referee: lessRefereedTeam([losers[0], losers[2], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[0], teamB: losers[5], referee: lessRefereedTeam([losers[2], losers[3], losers[4], losers[1]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[4], teamB: losers[3], referee: lessRefereedTeam([losers[0], losers[1], losers[2], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[2], teamB: losers[1], referee: lessRefereedTeam([losers[0], losers[3], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'bracket', scoreA: 0, scoreB: 0})
    return new_matches
}

function is_winner(match: Match, team: Team) {
    return (
        (match.teamA == team.name && match.scoreA > match.scoreB) ||
        (match.teamB == team.name && match.scoreB > match.scoreA)
    );
}

function wins_in_bracket(matches: Match[], team: Team) {
    return matches.filter((m) => m.phase == 'bracket' && is_winner(m, team)).length;
}

function points_in_bracket(matches: Match[], team: Team) {
    return matches
        .filter((m) => m.phase == 'bracket')
        .map((m) => (m.teamA === team.name ? m.scoreA : m.teamB === team.name ? m.scoreB : 0))
        .reduce((a, b) => a + b, 0);
}

function Finales(teams: Team[], matches: Match[]) {
    let wins = matches.filter(m => ['swiss1', 'swiss2', 'swiss3'].includes(m.phase)).map(m => m.scoreA > m.scoreB ? m.teamA : m.teamB).reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
    }, {})
    let loses = matches.filter(m => ['swiss1', 'swiss2', 'swiss3'].includes(m.phase)).map(m => m.scoreA < m.scoreB ? m.teamA : m.teamB).reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
    }, {})

    let winners = teams.filter(t => wins[t.name] >=2)
                        .map((team: Team) => {return {name: team.name, score: wins_in_bracket(matches, team)*1000 + points_in_bracket(matches, team)}})
                        .toSorted(
                            (teamA, teamB) => teamB.score - teamA.score
                        ).map(team => team.name)
    let losers = teams.filter(t => loses[t.name] >=2)
                        .map((team: Team) => {return {name: team.name, score: wins_in_bracket(matches, team)*1000 + points_in_bracket(matches, team)}})
                        .toSorted(
                            (teamA, teamB) => teamB.score - teamA.score
                        ).map(team => team.name)
    let new_matches = []
    new_matches.push({teamA: winners[0], teamB: winners[1], referee: lessRefereedTeam([winners[2], winners[3], winners[4], winners[5]], matches), court: 0, phase: 'finale', scoreA: 0, scoreB: 0})
    new_matches.push({teamA: losers[0], teamB: losers[1], referee: lessRefereedTeam([losers[2], losers[3], losers[4], losers[5]], [...matches,...new_matches]), court: 1, phase: 'finale', scoreA: 0, scoreB: 0})
    return new_matches
}

export async function createMatches(pb, matches, teams) {
    const alreadyPlayed = matches.filter(m => m.scoreA != 0 || m.scoreB != 0) 
	if (teams.length<12) {
		return "⚠️ Il n'y a pas encore 12 equipes."	
	} else if (matches.length == 0) {
        for (const match of Round1(teams)) {
            await pb.collection('matches').create(match);
        };
        return ''
    } else if (alreadyPlayed.length < 6) {
        return "⚠️ La phase 1 n'est pas encore terminée."
	} else if (alreadyPlayed.length == 6 && matches.length==6) {
        for (const match of Round2(teams, matches)) {
            await pb.collection('matches').create(match);
        };
        return ''
	} else if (alreadyPlayed.length < 12) {
        return "⚠️ La phase 2 n'est pas encore terminée."
	} else if (alreadyPlayed.length == 12 && matches.length==12) {
        for (const match of Round3(teams, matches)) {
            await pb.collection('matches').create(match);
            };
        return ''
	} else if (alreadyPlayed.length < 15) {
        return "⚠️ La phase 3 n'est pas encore terminée."
	} else if (alreadyPlayed.length == 15 && matches.length==15) {
        for (const match of Bracket(teams, matches)) {
            await pb.collection('matches').create(match);
            };
        return ''
	} else if (alreadyPlayed.length < 45) {
        return "⚠️ La phase 3 n'est pas encore terminée."
	} else if (alreadyPlayed.length == 45 && matches.length==45) {
        for (const match of Finales(teams, matches)) {
            await pb.collection('matches').create(match);
            };
        return ''
	}
    return '⚠️ Problem'
};