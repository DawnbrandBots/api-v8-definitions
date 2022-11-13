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

export const locales = {
	en: Nullable(Type.String()),
	de: Nullable(Type.String()),
	es: Nullable(Type.String()),
	fr: Nullable(Type.String()),
	it: Nullable(Type.String()),
	pt: Nullable(Type.String()),
	ja: Nullable(Type.String()),
	ko: Nullable(Type.String()),
	"zh-CN": Nullable(Type.String()),
	"zh-TW": Nullable(Type.String())
};

export const CardSet = Type.Object({
	set_number: Type.String(),
	set_name: Type.String(),
	// could be enum but who knows
	rarities: Nullable(Type.Array(Type.String()))
});

export const CardSetList = Type.Optional(Type.Array(CardSet));
