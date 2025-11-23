
import type {Match, Team} from '$lib/components/schemas.ts';

function lessRefereedTeam(candidates: string[], matches: Match[]): string {
    const counts = matches.map(m => m.referee).reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
        }, {});
	let referee = candidates.toSorted((a,b) => counts[a] - counts[b])[0]
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
    
	return [
        {teamA: winners[0], teamB: winners[1], referee: lessRefereedTeam([winners[2], winners[3], winners[4], winners[5]], matches), court: 0, phase: 'swiss2'},
        {teamA: winners[2], teamB: winners[3], referee: lessRefereedTeam([winners[0], winners[1], winners[4], winners[5]], matches), court: 0, phase: 'swiss2'},
        {teamA: winners[4], teamB: winners[5], referee: lessRefereedTeam([winners[2], winners[3], winners[0], winners[1]], matches), court: 0, phase: 'swiss2'},
        {teamA: losers[0], teamB: losers[1], referee: lessRefereedTeam([losers[2], losers[3], losers[4], losers[5]], matches), court: 1, phase: 'swiss2'},
        {teamA: losers[2], teamB: losers[3], referee: lessRefereedTeam([losers[0], losers[1], losers[4], losers[5]], matches), court: 1, phase: 'swiss2'},
        {teamA: losers[4], teamB: losers[5], referee: lessRefereedTeam([losers[2], losers[3], losers[0], losers[1]], matches), court: 1, phase: 'swiss2'},
	]
}

function Round3(teams: Team[], matches: Match[]) {
    let wins = matches.map(m => m.scoreA > m.scoreB ? m.teamA : m.teamB).reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
        }, {})
    let playingTeams = teams.filter(t => wins[t] == 1).map(t=>t.name)
    
    
	return [
        {teamA: playingTeams[0], teamB: playingTeams[1], referee: playingTeams[4], court: 0, phase: 'swiss3'},
        {teamA: playingTeams[2], teamB: playingTeams[3], referee: playingTeams[5], court: 1, phase: 'swiss3'},
        {teamA: playingTeams[4], teamB: playingTeams[5], referee: lessRefereedTeam([playingTeams[0], playingTeams[1]], matches), court: 0, phase: 'swiss3'},
	]
}


export async function createMatches(pb, matches, teams) {
    let next_matches: Match[] = []
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
	} else if (alreadyPlayed.length == 6) {
        for (const match of Round2(teams, matches)) {
            await pb.collection('matches').create(match);
        };
        return ''
	} else if (alreadyPlayed.length < 12) {
        return "⚠️ La phase 2 n'est pas encore terminée."
	} else if (alreadyPlayed.length == 12) {
        for (const match of Round3(teams, matches)) {
            await pb.collection('matches').create(match);
            };
        return ''
	} else if (alreadyPlayed.length < 15) {
        return "⚠️ La phase 3 n'est pas encore terminée."
	} else if (alreadyPlayed.length == 15) {
        // Bracket(teams, matches)
        return ''
	}
    return '⚠️ Problem'
};