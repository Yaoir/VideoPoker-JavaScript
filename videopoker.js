/* Uncomment if you want to run it directly as a command.
   Assumes you have Node installed in /usr/local/bin */
/*#!/usr/local/bin/node */

var printf = require('printf')
var rs = require('readline-sync')

/* Replacement for getchar() */

var stdin_line = ""
var stdin_pos = 1

/* JavaScript doesn't have 'c' or '\n' char values, so we have to do this: */

/* more ASCII key values */

const key_B = 98
const key_E = 101
const key_F = 102
const key_H = 104
const key_J = 106
const key_K = 107
const key_L = 108
const key_Q = 113
const key_0 = 48
const key_1 = 49
const key_6 = 54
const key_semicolon = 59
const key_newline = 10

function getchar()
{
        if(stdin_pos == stdin_line.length)
        {
		++stdin_pos
		return key_newline
	}

        if(stdin_pos > stdin_line.length)
        {
                stdin_line = rs.question('')
                stdin_pos = 0
        }

        if(stdin_line.length == 0)
        {
                stdin_pos = 1
                return key_newline
        }

	return Number(stdin_line.charCodeAt(stdin_pos++))
}

function ungetc()
{
	--stdin_pos
}

const VERSION = "videopoker 1.0"

/* values for -uN unicode flag */

const UNICODE_TTY = 0
const UNICODE_OFF = 1
const UNICODE_SUITS = 2
const UNICODE_CARDS = 3

var unicode = UNICODE_SUITS

// unicode is nonzero if unicode output is enabled.

var hands = 0       // number of hands played

/* The number of cards in the hand */

const CARDS = 5

/* The number of cards in the deck */

const CARDSINDECK = 52

const CLUBS = 0
const DIAMONDS = 1
const HEARTS = 2
const SPADES = 3

/* one-character suit designations */

const NUMSUITS = 4

var suitname =
[
	"C",
	"D",
	"H",
	"S",
]

/* indices for card values */

const TWO    = 1
const THREE  = 2
const FOUR   = 3
const FIVE   = 4
const SIX    = 5
const SEVEN  = 6
const EIGHT  = 7
const NINE   = 8
const TEN    = 9 /* needed for recognizing royal flush, or tens or better (TEN), or jacks or better (JACK) */
const JACK  = 10 /* needed for recognizing royal flush, or tens or better (TEN), or jacks or better (JACK) */
const QUEEN = 11
const KING  = 12
const ACE   = 13  /* needed for recognizing Ace-low straight (Ace, 2, 3, 4, 5) */

/* the card type, for holding infomation about the deck of cards */

// In Go, it's like this:
//type card struct
//{
//        index int       /* cards value, minus 1 */
//        sym string      /* textual appearance */
//        uc string       /* Unicode value for the card */
//        suit int        /* card's suit (see just below) */
//        gone int        /* true if it's been dealt */
//}
// But JavaScript doesn't have structs or even real classes :(
// So...

/* The standard deck of 52 cards */

var deck =
[
/*      index, card, Unicode, suit, gone */
        { "index": TWO,   "sym": " 2", "uc": "\u{0001F0D2}", "suit": CLUBS, "gone": 0 },
        { "index": THREE, "sym": " 3", "uc": "\u{0001F0D3}", "suit": CLUBS, "gone": 0 },
        { "index": FOUR,  "sym": " 4", "uc": "\u{0001F0D4}", "suit": CLUBS, "gone": 0 },
        { "index": FIVE,  "sym": " 5", "uc": "\u{0001F0D5}", "suit": CLUBS, "gone": 0 },
        { "index": SIX,   "sym": " 6", "uc": "\u{0001F0D6}", "suit": CLUBS, "gone": 0 },
        { "index": SEVEN, "sym": " 7", "uc": "\u{0001F0D7}", "suit": CLUBS, "gone": 0 },
        { "index": EIGHT, "sym": " 8", "uc": "\u{0001F0D8}", "suit": CLUBS, "gone": 0 },
        { "index": NINE,  "sym": " 9", "uc": "\u{0001F0D9}", "suit": CLUBS, "gone": 0 },
        { "index": TEN,   "sym": "10", "uc": "\u{0001F0Da}", "suit": CLUBS, "gone": 0 },
        { "index": JACK,  "sym": " J", "uc": "\u{0001F0Db}", "suit": CLUBS, "gone": 0 },
        { "index": QUEEN, "sym": " Q", "uc": "\u{0001F0Dd}", "suit": CLUBS, "gone": 0 },
        { "index": KING,  "sym": " K", "uc": "\u{0001F0De}", "suit": CLUBS, "gone": 0 },
        { "index": ACE,   "sym": " A", "uc": "\u{0001F0D1}", "suit": CLUBS, "gone": 0 },

        { "index": TWO,   "sym": " 2", "uc": "\u{0001F0C2}", "suit": DIAMONDS, "gone": 0 },
        { "index": THREE, "sym": " 3", "uc": "\u{0001F0C3}", "suit": DIAMONDS, "gone": 0 },
        { "index": FOUR,  "sym": " 4", "uc": "\u{0001F0C4}", "suit": DIAMONDS, "gone": 0 },
        { "index": FIVE,  "sym": " 5", "uc": "\u{0001F0C5}", "suit": DIAMONDS, "gone": 0 },
        { "index": SIX,   "sym": " 6", "uc": "\u{0001F0C6}", "suit": DIAMONDS, "gone": 0 },
        { "index": SEVEN, "sym": " 7", "uc": "\u{0001F0C7}", "suit": DIAMONDS, "gone": 0 },
        { "index": EIGHT, "sym": " 8", "uc": "\u{0001F0C8}", "suit": DIAMONDS, "gone": 0 },
        { "index": NINE,  "sym": " 9", "uc": "\u{0001F0C9}", "suit": DIAMONDS, "gone": 0 },
        { "index": TEN,   "sym": "10", "uc": "\u{0001F0Ca}", "suit": DIAMONDS, "gone": 0 },
        { "index": JACK,  "sym": " J", "uc": "\u{0001F0Cb}", "suit": DIAMONDS, "gone": 0 },
        { "index": QUEEN, "sym": " Q", "uc": "\u{0001F0Cd}", "suit": DIAMONDS, "gone": 0 },
        { "index": KING,  "sym": " K", "uc": "\u{0001F0Ce}", "suit": DIAMONDS, "gone": 0 },
        { "index": ACE,   "sym": " A", "uc": "\u{0001F0C1}", "suit": DIAMONDS, "gone": 0 },

        { "index": TWO,   "sym": " 2", "uc": "\u{0001F0B2}", "suit": HEARTS, "gone": 0 },
        { "index": THREE, "sym": " 3", "uc": "\u{0001F0B3}", "suit": HEARTS, "gone": 0 },
        { "index": FOUR,  "sym": " 4", "uc": "\u{0001F0B4}", "suit": HEARTS, "gone": 0 },
        { "index": FIVE,  "sym": " 5", "uc": "\u{0001F0B5}", "suit": HEARTS, "gone": 0 },
        { "index": SIX,   "sym": " 6", "uc": "\u{0001F0B6}", "suit": HEARTS, "gone": 0 },
        { "index": SEVEN, "sym": " 7", "uc": "\u{0001F0B7}", "suit": HEARTS, "gone": 0 },
        { "index": EIGHT, "sym": " 8", "uc": "\u{0001F0B8}", "suit": HEARTS, "gone": 0 },
        { "index": NINE,  "sym": " 9", "uc": "\u{0001F0B9}", "suit": HEARTS, "gone": 0 },
        { "index": TEN,   "sym": "10", "uc": "\u{0001F0Ba}", "suit": HEARTS, "gone": 0 },
        { "index": JACK,  "sym": " J", "uc": "\u{0001F0Bb}", "suit": HEARTS, "gone": 0 },
        { "index": QUEEN, "sym": " Q", "uc": "\u{0001F0Bd}", "suit": HEARTS, "gone": 0 },
        { "index": KING,  "sym": " K", "uc": "\u{0001F0Be}", "suit": HEARTS, "gone": 0 },
        { "index": ACE,   "sym": " A", "uc": "\u{0001F0B1}", "suit": HEARTS, "gone": 0 },

        { "index": TWO,   "sym": " 2", "uc": "\u{0001F0A2}", "suit": SPADES, "gone": 0 },
        { "index": THREE, "sym": " 3", "uc": "\u{0001F0A3}", "suit": SPADES, "gone": 0 },
        { "index": FOUR,  "sym": " 4", "uc": "\u{0001F0A4}", "suit": SPADES, "gone": 0 },
        { "index": FIVE,  "sym": " 5", "uc": "\u{0001F0A5}", "suit": SPADES, "gone": 0 },
        { "index": SIX,   "sym": " 6", "uc": "\u{0001F0A6}", "suit": SPADES, "gone": 0 },
        { "index": SEVEN, "sym": " 7", "uc": "\u{0001F0A7}", "suit": SPADES, "gone": 0 },
        { "index": EIGHT, "sym": " 8", "uc": "\u{0001F0A8}", "suit": SPADES, "gone": 0 },
        { "index": NINE,  "sym": " 9", "uc": "\u{0001F0A9}", "suit": SPADES, "gone": 0 },
        { "index": TEN,   "sym": "10", "uc": "\u{0001F0Aa}", "suit": SPADES, "gone": 0 },
        { "index": JACK,  "sym": " J", "uc": "\u{0001F0Ab}", "suit": SPADES, "gone": 0 },
        { "index": QUEEN, "sym": " Q", "uc": "\u{0001F0Ad}", "suit": SPADES, "gone": 0 },
        { "index": KING,  "sym": " K", "uc": "\u{0001F0Ae}", "suit": SPADES, "gone": 0 },
        { "index": ACE,   "sym": " A", "uc": "\u{0001F0A1}", "suit": SPADES, "gone": 0 },
]

/* The hand. It holds five cards. */

var hand = []

/* sorted hand, for internal use when recognizing winners */

var shand = []

/* keys used to select kept cards */

const NUMKEYS = 5

// var keys = [ key_F, key_J, key_K, key_L, key_semicolon, ]
var keys = [ key_H, key_J, key_K, key_L, key_semicolon, ]

/* initial number of chips held */

const INITCHIPS = 1000
var score = INITCHIPS

/* minimum and maximum swing of score during this game */

var score_low = INITCHIPS
var score_high = INITCHIPS

/* The games starts with a bet of 10, the minimum allowed */

const INITMINBET = 10

var minbet = INITMINBET
var bet = INITMINBET

/* number of chips or groups of 10 chips bet */

var betmultiplier = 1

/* Options */

/* -b (Bold): print in boldface */

var boldface = false

/* -mh (Mark Held): Mark cards that are held */

var markheld = false

/* -q (Quiet): Don't print banner or final report */

var quiet = false

/* Sanity check: check that there are no duplicate cards in hand */

function check_for_dupes()
{
	return false
}

/*
	Some ANSI Terminal escape codes:
	ESC[38;5; then one of (0m = black, 1m = red, 2m = green, 3m = yellow,
			       4m = blue, 5m = magenta, 6m = cyan, 7m = white)
	ESC[1m = bold, ESC[0m = reset all attributes
*/

/* The below are part of the escape codes listed above.
   Do not change the values. */
const BLACK = 0
const RED = 1
const GREEN = 2
const YELLOW = 3
const BLUE = 4
const MAGENTA = 5
const CYAN = 6
const WHITE = 7

var stdout = process.stdout

function color(color)
{
	if (unicode == UNICODE_TTY) { return }
	printf(stdout,"\033[38;5;%dm",color)
}

function ANSIbold() {
	if (unicode == UNICODE_TTY) { return }
	printf(stdout,"\033[1m")
}

function ANSIreset()
{
	if (unicode == UNICODE_TTY) { return }
	printf(stdout,"\033[0m")
	if (boldface) { ANSIbold() }
}

/*
	Display the hand
	This is where the Unicode output setting (-u<N> option) takes effect,
	so there are three different ways it can display the cards.
*/

function showhand()
{
	var i
	/* Unicode characters for the suits */
	const spade = "\u2660"
	const heart = "\u2665"
	const diamond = "\u2666"
	const club = "\u2663"

	/* Method 1: Unicode Card Faces (-u3 option),
	   which requires only one line  */
	
	if (unicode == UNICODE_CARDS)	/* print the Unicode card faces */
	{
		for(i = 0; i < CARDS; i++)
		{
			switch(hand[i].suit)
			{
				case DIAMONDS:
				case HEARTS:
					color(RED)
					printf(stdout,"%s ", hand[i].uc)
					ANSIreset()
					break
				case CLUBS:
				case SPADES:
					printf(stdout,"%s ", hand[i].uc)
					break
			}
		}
		/* print a space to separate output from user input */
		printf(stdout," ")
		return
	}

	/* Method 2: Two Line Output for -u0/-u1/-u2 options, requires 2 lines */

	if(boldface) { ANSIbold() }

	/* First Line of output: show card values */

	for(i = 0; i < CARDS; i++)
	{
		switch(hand[i].suit)
		{
			case DIAMONDS:
			case HEARTS:
				/* print in red */
				color(RED)
				printf(stdout,"%s", hand[i].sym)
				ANSIreset()
				printf(stdout," ")
				break
			case CLUBS:
			case SPADES:
				/* print in default text color */
				printf(stdout,"%s ", hand[i].sym)
				break
		}
	}

	printf(stdout,"\n")

	for(i = 0; i < CARDS; i++)
	{
		if(unicode == UNICODE_SUITS)
		{
			/* Unicode method */
			switch(hand[i].suit)
			{
				case DIAMONDS:
					/* print in red */
					printf(stdout," ")
					color(RED)
					printf(stdout,"%s", diamond)
					ANSIreset()
					printf(stdout," ")
					break
				case HEARTS:
					printf(stdout," ")
					color(RED)
					printf(stdout,"%s", heart)
					ANSIreset()
					printf(stdout," ")
					break
				case CLUBS:
					/* print in default text color */
					printf(stdout," %s ", club)
					break
				case SPADES:
					printf(stdout," %s ", spade)
					break
			}
		}
		else
		{
			/* ASCII method */
			switch(hand[i].suit)
			{
				case DIAMONDS:
				case HEARTS:
					/* print H or D in red */
					printf(stdout," ")
					color(RED)
					printf(stdout,"%s", suitname[hand[i].suit])
					ANSIreset()
					printf(stdout," ")
					break
				case CLUBS:
				case SPADES:
					/* print S or C in default text color */
					printf(stdout," %s ", suitname[hand[i].suit])
					break
			}
		}
	}

	/* print a space to separate output from user input */
	printf(stdout," ")

	if(check_for_dupes())
	{
		printf(stdout,"\n!!! DUPLICATE CARD !!!\n\n")
		process.exit(1)
	}
}

/* The various video poker games that are supported */

const AllAmerican = 0
const TensOrBetter = 1
const BonusPoker = 2
const DoubleBonus = 3
const DoubleBonusBonus = 4
const JacksOrBetter = 5		// default
const JacksOrBetter95 = 6
const JacksOrBetter86 = 7
const JacksOrBetter85 = 8
const JacksOrBetter75 = 9
const JacksOrBetter65 = 10
const NUMGAMES = 11

/*
	The game in play. Default is Jacks or Better,
	which is coded into initialization of static data
*/

var game = JacksOrBetter

var gamenames =
[
	"All American",
	"Tens or Better",
	"Bonus Poker",
	"Double Bonus",
	"Double Bonus Bonus",
	"Jacks or Better",
	"9/5 Jacks or Better",
	"8/6 Jacks or Better",
	"8/5 Jacks or Better",
	"7/5 Jacks or Better",
	"6/5 Jacks or Better",
]

/* Error message for -g option. Also a way to display the list of games */

function badgame()
{
	printf(stdout,"Video Poker: -g option is missing valid game name.\n")
	printf(stdout,"Available games are:\n")
	printf(stdout,"aa   - All American\n")
	printf(stdout,"10s  - Tens or Better\n")
/*
	printf(stdout,"bon  - Bonus Poker\n")
	printf(stdout,"db   - Double Bonus\n")
	printf(stdout,"dbb  - Double Bonus Bonus\n")
*/
	printf(stdout,"jb95 - 9/5 Jacks or Better\n")
	printf(stdout,"jb86 - 8/6 Jacks or Better\n")
	printf(stdout,"jb85 - 8/5 Jacks or Better\n")
	printf(stdout,"jb75 - 7/5 Jacks or Better\n")
	printf(stdout,"jb65 - 6/5 Jacks or Better\n")
	process.exit(0)
}

/* Functions that recognize winning hands */

/* These functions operate on the *sorted* hand, which makes it much easier */

/*
	Flush:
	returns true if the sorted hand is a flush
*/

function flush() 
{
	if(shand[0].suit == shand[1].suit &&
	   shand[1].suit == shand[2].suit &&
	   shand[2].suit == shand[3].suit &&
	   shand[3].suit == shand[4].suit) { return true }

	return false
}

/*
	Straight:
	returns true if the sorted hand is a straight
*/

function straight()
{
	if(shand[1].index == shand[0].index + 1 &&
	   shand[2].index == shand[1].index + 1 &&
	   shand[3].index == shand[2].index + 1 &&
	   shand[4].index == shand[3].index + 1) { return true }

        if(shand[4].index == ACE   &&
           shand[0].index == TWO   &&
           shand[1].index == THREE &&
           shand[2].index == FOUR  &&
           shand[3].index == FIVE) { return true }

	return false
}

/*
	Four of a kind:
	the middle 3 all match, and the first or last matches those
*/

function four()
{
	if((shand[1].index == shand[2].index &&
	    shand[2].index == shand[3].index ) &&
	   ( shand[0].index == shand[2].index ||
	     shand[4].index == shand[2].index)) { return true }

	return false
}

/*
	Full house:
	3 of a kind and a pair
*/

function full()
{
	if(shand[0].index == shand[1].index &&
	  (shand[2].index == shand[3].index &&
	   shand[3].index == shand[4].index)) { return true }

	if(shand[3].index == shand[4].index &&
	  (shand[0].index == shand[1].index &&
	   shand[1].index == shand[2].index)) { return true }

	return false
}

/*
	Three of a kind:
	it can appear 3 ways
*/

function three()
{
	if(shand[0].index == shand[1].index &&
	   shand[1].index == shand[2].index) { return true }

	if(shand[1].index == shand[2].index &&
	   shand[2].index == shand[3].index) { return true }

	if( shand[2].index == shand[3].index &&
	   shand[3].index == shand[4].index) { return true }

	return false
}

/*
	Two pair:
	it can appear in 3 ways
*/

function twopair()
{
	if(((shand[0].index == shand[1].index) && (shand[2].index == shand[3].index)) ||
	   ((shand[0].index == shand[1].index) && (shand[3].index == shand[4].index)) ||
	   ((shand[1].index == shand[2].index) && (shand[3].index == shand[4].index))) { return true }

	return false
}

/*
	Two of a kind (pair), jacks or better
	or if the game is Tens or Better, 10s or better.
*/

function two()
{
	var min = JACK

	if(game == TensOrBetter) { min = TEN }

	if(shand[0].index == shand[1].index && shand[1].index >= min) { return true }
	if(shand[1].index == shand[2].index && shand[2].index >= min) { return true }
	if(shand[2].index == shand[3].index && shand[3].index >= min) { return true }
	if(shand[3].index == shand[4].index && shand[4].index >= min) { return true }

	return false
}

/*
	This bunch of consts is used to index into
	paytable[] and handname[], so make sure the two match.
*/

const ROYAL   = 0
const STRFL   = 1
const FOURK   = 2
const FULL    = 3
const FLUSH   = 4
const STR     = 5
const THREEK  = 6
const TWOPAIR = 7
const PAIR    = 8
const NOTHING = 9
/* the number of the above: */
const NUMHANDTYPES = 10

var paytable =
[
	800,	/* royal flush: 800 */
	50,	/* straight flush: 50 */
	25,	/* 4 of a kind: 25 */
	9,	/* full house: 9 */
	6,	/* flush: 6 */
	4,	/* straight: 4 */
	3,	/* 3 of a kind: 3 */
	2,	/* two pair: 2 */
	1,	/* jacks or better: 1 */
	0,	/* nothing */
]

var handname =
[
	"Royal Flush    ",
	"Straight Flush ",
	"Four of a Kind ",
	"Full House     ",
	"Flush          ",
	"Straight       ",
	"Three of a Kind",
	"Two Pair       ",
	"Pair           ",
	"Nothing        ",
]

const INVALID = 100	/* higher than any valid card index */

/* returns type of hand */

function recognize()
{
	var i, j, f
	var min = INVALID
	var tmp  = []
	var st, fl 	/* both are auto-initialized to 0 */

	/* Sort hand into sorted hand (shand) */

	/* make copy of hand */
	for(i = 0; i < CARDS; i++)
	{
		// tmp[i] = hand[i]
		tmp[i] = Object.assign({},hand[i])
	}

	for(i = 0; i < CARDS; i++)
	{
		/* put lowest card in hand into next place in shand */

		for(j = 0; j < CARDS; j++)
		{
			if(tmp[j].index <= min)
			{
				min = tmp[j].index
				f = j
			}
		}

		shand[i] = Object.assign({},tmp[f])
		/* take the card out of consideration */
		tmp[f].index = INVALID	/* larger than any card */
		min = INVALID
	}

	/* royal and straight flushes, straight, and flush */

	fl = flush()
	st = straight()

	if(st && fl && shand[0].index == TEN) { return ROYAL }
	if(st && fl) { return STRFL }
	if(four()) { return FOURK }
	if(full()) { return FULL }
	if(fl) { return FLUSH }
	if(st) { return STR }
	if(three()) { return THREEK }
	if(twopair()) { return TWOPAIR }
	if(two()) { return PAIR }

	/* Nothing */

	return NOTHING
}

/* The loop */

function play()
{
	var i
	var crd
	var c
	var hold = []
	var digit

	/* initialize deck */
	for(i = 0; i < CARDSINDECK; i++) { deck[i].gone = 0 }

	/* initialize hold[] */
	for(i = 0; i < CARDS; i++) { hold[i] = 0 }

	score -= bet

	for(i = 0; i < CARDS; i++)
	{
		/* find a card not already dealt */

		for (;;)
		{
			crd = Math.floor(Math.random()*CARDSINDECK)
			if(deck[crd].gone == 0) { break }
		}

		deck[crd].gone = 1
		hand[i] = deck[crd]
	}

	showhand()

	/* get cards to hold, and replace others */

	for (;;)
	{
		c = getchar()

		if(c == key_newline) { break }

		if(c == key_Q || c == key_E)
		{
			boldface = false
			ANSIreset()

			if( ! quiet)
			{
				printf(stdout,"\nYou quit with %d chips after playing %d hands.\n",score+bet,hands)
				printf(stdout,"Range: %d - %d\n", score_low, score_high)
			}
			process.exit(0)
		}

		if(c == key_B)	/* Change the bet. Only 1, 2, 3, 4, and 5 are allowed. */
		{
			digit = getchar()
			if(digit <= key_1 || digit >= key_6)
			{
				ungetc()
			}
			else
			{
				betmultiplier = digit - key_0
				bet = betmultiplier * minbet
			}
			continue
		}

		for(i = 0; i < NUMKEYS; i++)
		{
			if(keys[i] == c)
			{
				/* flip bit to hold/discard it */
				hold[i] ^= 1
			}
		}
	}

	/* Optional Line: mark held cards */

	if(markheld)
	{
		for(i = 0; i < CARDS; i++)
		{
			var pm
			if(hold[i] != 0) { pm = " +" }
			else { pm = "  " }

			printf(stdout,"%s ", pm)
		}
		printf(stdout,"\n")
	}

	/* replace cards not held */

	for(i = 0; i < CARDS; i++)
	{
		if(hold[i] == 0)
		{
			for(;;)
			{
				crd = Math.floor(Math.random()*CARDSINDECK)
				if(deck[crd].gone == 0) { break }
			}

			deck[crd].gone = 1
			hand[i] = deck[crd]
		}
	}

	/* print final hand */

	showhand()

	/* recognize and score hand */

	i = recognize()

	score += paytable[i] * bet

	printf(stdout,"%s  ",handname[i])
	printf(stdout,"%d\n\n",score)

	hands++

	if(score < score_low)  { score_low  = score }
	if(score > score_high) { score_high = score }

	if(score < bet)
	{
		for(; score < bet && betmultiplier > 1;)
		{
			betmultiplier--;
			bet = minbet * betmultiplier
		}

		if(score < bet)
		{
			boldface = false
			ANSIreset()
			if( ! quiet)
			{
				printf(stdout,"You ran out of chips after playing %d hands.\n", hands)
				if(score_high > INITCHIPS) { printf(stdout,"At one point, you had %d chips.\n", score_high) }
			}
			process.exit(0)
		}
		else
		{
			printf(stdout,"You are low on chips. Your bet has been reduced to %d.\n\n", bet)
		}
	}
}

/* Initialize, Handle arguments, enter loop */

function main()
{
	var ai = 0
	var i = 0, cnt = 0
	var arg = ""

	/* process arguments */

	for(cnt = (process.argv.length-1); cnt > 1;)
	{
		/* -b (Bold) */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'b' &&
		   process.argv[2+ai].length == 2)
		{
			if(cnt < 2) { badgame() }

			boldface = true

			/* advance to next argument */
			ai += 1
			cnt -= 1
			continue
		}

		/* -b1 (Bet 1 Chip) */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'b' &&
		   process.argv[2+ai][2] == '1' &&
		   process.argv[2+ai].length == 3)
		{

			if(cnt < 2) { badgame() }

			/* set minimum bet */
			minbet = 1; bet = 1

			/* advance to next argument */
			ai += 1
			cnt -= 1
			continue
		}

		/* -g <name>  Choose Game */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'g' &&
		   process.argv[2+ai].length == 2)
		{
			if(cnt < 3) { badgame() }
			arg = process.argv[3+ai]

			if(arg == "jb95") {
				game = JacksOrBetter95
			} else if(arg == "jb86") {
				game = JacksOrBetter86
			} else if(arg == "jb85") {
				game = JacksOrBetter85
			} else if(arg == "jb75") {
				game = JacksOrBetter75
			} else if(arg == "jb65") {
				game = JacksOrBetter65
			} else if(arg == "aa") {
				game = AllAmerican
			} else if(arg == "10s") {
				game = TensOrBetter
			} else if(arg == "tens") {
				game = TensOrBetter
/*
			} else if(arg == "bon") {
				game = BonusPoker
			} else if(arg == "db") {
				game = DoubleBonus
			} else if(arg == "dbb") {
				game = DoubleBonusBonus
*/
			} else { badgame() }

			setgame(game)

			/* advance to next argument */
			ai += 2
			cnt -= 2
			continue
		}

		/* -is (Initial Score) */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'i' &&
		   process.argv[2+ai][2] == 's' &&
		   process.argv[2+ai].length == 3)
		{
			if(cnt < 3) { badgame() }

			score = Number(process.argv[3+ai])

			if(score <= 0 || score > 100000)
			{
				printf(stdout,"Video Poker: bad number given with the -is option.\n")
				process.exit(1)
			}

			if(score%10 != 0) { minbet = 1; bet = 1 }

			/* advance to next argument */
			ai += 2
			cnt -= 2
			continue
		}

		/* -k <5-char-string>  Redefine input keys (default is " jkl;" */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'k' &&
		   process.argv[2+ai].length == 2)
		{
			if(cnt < 3) { badgame() }
			arg = process.argv[3+ai]

			if(arg.length != NUMKEYS)
			{
				// complain and exit
				printf(stdout,"Video Poker: the string given with the -k option is the wrong length.\n")
				process.exit(1)
			}

			/* copy the string into keys[] */
			for(i = 0; i < NUMKEYS; i++)
			{
				if(arg[i] == 'q' || arg[i] == 'e')
				{
					printf(stdout,"Video Poker: for the -k option, the string may not contain q or e.\n")
					process.exit(1)
				}
				keys[i] = String.charCodeAt(arg[i][0])
			}

			/* advance to next argument */
			ai += 2
			cnt -= 2
			continue
		}

		/* -mh (Mark Held) */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'm' &&
		   process.argv[2+ai][2] == 'h' &&
		   process.argv[2+ai].length == 3)
		{
			if(cnt < 2) { badgame() }

			/* turn on Mark Held flag */
			markheld = true

			/* advance to next argument */
			ai += 1
			cnt -= 1
			continue
		}

		/* -q (Quiet) */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'q' &&
		   process.argv[2+ai].length == 2)
		{
			if(cnt < 2) { badgame() }

			/* turn on Quiet flag */
			quiet = true

			/* advance to next argument */
			ai += 1
			cnt -= 1
			continue
		}

		/* -u<n>  Unicode Output */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'u' &&
		   process.argv[2+ai].length > 2)
		{
			switch(process.argv[2+ai][2])
			{

				case '0': unicode = UNICODE_TTY; break
				case '1': unicode = UNICODE_OFF; break
				case '2': unicode = UNICODE_SUITS; break
				case '3': unicode = UNICODE_CARDS; break
				default:
					printf(stdout,"Video Poker: digit %d given with -u option is out of range.\n",process.argv[2+ai][2]-'0')
					process.exit(1)
			}
			/* advance to next argument */
			ai += 1
			cnt--
			continue
		}

		/* -v (Version) */

		if(process.argv[2+ai][0] == '-' &&
		   process.argv[2+ai][1] == 'v' &&
		   process.argv[2+ai].length == 2)
		{
			if(cnt < 2) { badgame() }

			printf(stdout,"%s\n",VERSION)
			process.exit(0)
		}

		/* unrecognized option */
		printf(stdout,"Video Poker: the %s option was not recognized\n",process.argv[2+ai])
		process.exit(1)
	}

	/* Before starting play, print the name of the game in green */

	if( ! quiet)
	{
		printf(stdout,"\n ")
		color(GREEN)
		ANSIbold()
		printf(stdout,"%s",gamenames[game])
		ANSIreset()
		printf(stdout,"\n\n")
	}

	for(;;) play()
}

/* do the work for the -g option */

function setgame(game)
{
	switch(game)
	{
		case JacksOrBetter95:
			paytable[FLUSH] = 5
			break;
		case JacksOrBetter86:
			paytable[FULL] = 8
			break;
		case JacksOrBetter85:
			paytable[FULL] = 8
			paytable[FLUSH] = 5
			break;
		case JacksOrBetter75:
			paytable[FULL] = 7
			paytable[FLUSH] = 5
			break;
		case JacksOrBetter65:
			paytable[FULL] = 6
			paytable[FLUSH] = 5
			break;
		case AllAmerican:
			paytable[FULL] = 8
			paytable[FLUSH] = 8
			paytable[STR] = 8
			paytable[PAIR] = 1
			break;
		case TensOrBetter:
			/* pay table same as JacksOrBetter65 */
			paytable[FULL] = 6
			paytable[FLUSH] = 5
			break;
/*
		case BonusPoker:
			printf(stdout,"Bonus Poker is unimplemented in this version.\n")
			process.exit(0)
		case DoubleBonus:
			printf(stdout,"Double Bonus is unimplemented in this version.\n")
			process.exit(0)
		case DoubleBonusBonus:
			printf(stdout,"Double Bonus Bonus is unimplemented in this version.\n")
			process.exit(0)
*/
	}
}

/* execution starts here. Just call main(), as in C or Go */

main()
