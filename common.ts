import { TSchema, Type } from "@sinclair/typebox";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const LOCALES = [
	"en", // English
	"de", // German
	"es", // Spanish
	"fr", // French
	"it", // Italian
	"pt", // Portuguese
	"ja", // Japanese
	"ko", // Korean
	"zh-CN", // Simplified Chinese
	"zh-TW" // Traditional Chinese
] as const;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function keysToValue<K extends PropertyKey, V>(keys: readonly K[], value: V) {
	return Object.fromEntries(keys.map(key => [key, value])) as Record<K, V>;
}

export const localesNullableString = keysToValue(LOCALES, Nullable(Type.String()));

export const name = Type.Object({
	...localesNullableString,
	ja_romaji: Nullable(Type.String()),
	ko_rr: Nullable(Type.String())
});

const CardSet = Type.Object({
	set_number: Type.String(),
	set_name: Type.String(),
	// could be enum but who knows
	rarities: Nullable(Type.Array(Type.String()))
});
const CardSetList = Type.Optional(Type.Array(CardSet));
export const sets = Type.Object(keysToValue(LOCALES, CardSetList));

export const images = Type.Optional(
	Type.Array(
		Type.Object({
			index: Type.Union([Type.Integer({ minimum: 1 }), Type.String()]),
			image: Type.String(),
			illustration: Type.Optional(Type.String())
		})
	)
);

const localesOptionalBoolean = keysToValue(LOCALES, Type.Optional(Type.Literal(true)));
export const is_translation_unofficial = Type.Optional(
	Type.Object({
		name: Type.Optional(Type.Object(localesOptionalBoolean)),
		text: Type.Optional(Type.Object(localesOptionalBoolean))
	})
);
