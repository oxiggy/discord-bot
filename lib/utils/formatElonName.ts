export const GREEK_MAP: Record<string, string> = {
	'A': 'Λ', 'B': 'Β', 'C': 'ς', 'D': 'Δ', 'E': 'Ξ', 'F': 'Φ', 'G': 'G',
	'H': 'Η', 'I': 'ι', 'J': 'Ϳ', 'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν',
	'O': 'Ο', 'P': 'Ρ', 'Q': 'Θ', 'R': 'Γ', 'S': 'Σ', 'T': 'Τ', 'U': '∪',
	'V': 'ν', 'W': 'Ω', 'X': 'Χ', 'Y': 'Υ', 'Z': 'Ζ',

	'А': 'Λ', 'В': 'Β', 'Е': 'Ξ', 'К': 'Κ', 'М': 'Μ', 'Н': 'Η', 'О': 'Ο',
	'Р': 'Ρ', 'С': 'ς', 'Т': 'Τ', 'У': 'Υ', 'Х': 'Χ'
};


export const DIGIT_MAP: Record<string, string> = {
	'A': '4', 'B': '8', 'E': '3', 'G': '6', 'I': '1', 'L': '1',
	'O': '0', 'Q': '9', 'S': '5', 'T': '7', 'Z': '2',

	'О': '0', 'З': '3', 'В': '8', 'І': '1'
};

type FormatOptions = {
	greekMap?: Record<string, string>
	digitMap?: Record<string, string>
}

export function formatElonName(input: string, opts: FormatOptions = {}): string {
	const greek = opts.greekMap ?? GREEK_MAP
	const digits = opts.digitMap ?? DIGIT_MAP

	const parts = input.split(/(\s+)/) // сохраняем пробелы
	const out = parts.map((token) => {
		if (/^\s+$/.test(token)) return token // пробелы как есть
		return formatWord(token, greek, digits)
	})
	return out.join('')
}

function formatWord(wordRaw: string, greek: Record<string, string>, digits: Record<string, string>): string {
	if (!wordRaw) return wordRaw
	const w = wordRaw.toUpperCase()
	const n = w.length
	if (n <= 2) return w // коротыши — просто капсом

	// индексы базовые
	const iFirst = 0
	//const iLast  = n - 1;
	//const iPen   = n - 2;

	// правило места дефиса
	let iPreHyphen: number // символ слева от дефиса
	let usePairFrom: number // начало «последней пары» (откуда берём 2 символа для правой части)

	if (n >= 5) {
		iPreHyphen = n - 3
		usePairFrom = n - 2
	} else if (n === 4) {
		iPreHyphen = n - 2
		usePairFrom = n - 1
	} else {
		iPreHyphen = 1
		usePairFrom = 2
	}

	// 1) Первая буква — без греческой замены
	const first = w[iFirst]

	// 2) Средняя часть — всё между первой и iPreHyphen (исключая iPreHyphen)
	const middleRaw = w.slice(1, iPreHyphen)
	const middle = Array.from(middleRaw)
		.map((ch) => greek[ch] ?? ch)
		.join('')

	// 3) Левый элемент перед дефисом — греческая замена допустима
	const preHyphen = greek[w[iPreHyphen]] ?? w[iPreHyphen]

	// 4) Правая часть после дефиса — «пара» (1 или 2 символа),
	//    сначала греческие (если хочется), но потом цифры перекрывают
	const rightRaw = w.slice(usePairFrom) // 1 или 2 символа
	const right = Array.from(rightRaw)
		.map((ch) => digits[ch] ?? greek[ch] ?? ch)
		.join('')

	// Сборка с отбивками пробелами: первая, середина (если есть), и финальный токен
	const tokens: string[] = [first]
	if (middle.length) tokens.push(middle)
	tokens.push(`${preHyphen}-${right}`)
	return tokens.join(' ')
}
