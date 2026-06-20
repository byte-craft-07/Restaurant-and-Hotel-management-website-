export const AI_ORDER_EXAMPLES = [
  "2 spicy burgers and 1 cold coffee",
  "Veg food under Rs. 300",
  "High protein meal",
  "Food for kids",
];

const QUANTITY_WORDS = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

const STOP_WORDS = new Set([
  "i",
  "want",
  "need",
  "please",
  "give",
  "me",
  "some",
  "something",
  "food",
  "item",
  "items",
  "and",
  "with",
  "for",
  "under",
  "below",
  "less",
  "than",
  "rs",
  "rupees",
  "inr",
]);

const SPICY_WORDS = new Set([
  "spicy",
  "hot",
  "chilli",
  "chilly",
  "chili",
  "masala",
  "tandoori",
  "schezwan",
]);

const HEALTHY_WORDS = new Set([
  "healthy",
  "light",
  "salad",
  "fitness",
  "clean",
  "diet",
  "low",
  "calorie",
  "calories",
]);

const PROTEIN_WORDS = new Set([
  "protein",
  "proteins",
  "gym",
  "workout",
  "muscle",
  "chicken",
  "egg",
  "paneer",
  "tofu",
]);

const BUDGET_WORDS = new Set([
  "cheap",
  "budget",
  "affordable",
  "value",
  "low",
  "cost",
]);

const PREMIUM_WORDS = new Set([
  "premium",
  "special",
  "chef",
  "dinner",
  "rich",
  "signature",
  "best",
]);

const KIDS_WORDS = new Set([
  "kid",
  "kids",
  "child",
  "children",
  "baby",
  "mini",
]);

const COMBO_WORDS = new Set([
  "combo",
  "meal",
  "meals",
  "deal",
  "deals",
  "family",
  "pack",
]);

const VEGAN_WORDS = new Set(["vegan", "plant", "plantbased", "plant-based"]);

const SWEET_WORDS = new Set([
  "sweet",
  "dessert",
  "desserts",
  "cake",
  "chocolate",
  "ice",
  "kulfi",
]);

const MILD_WORDS = new Set(["mild", "nonspicy", "notspicy", "plain"]);

const DRINK_WORDS = new Set([
  "drink",
  "drinks",
  "coffee",
  "tea",
  "soda",
  "juice",
  "shake",
  "mocktail",
  "cold",
]);

const normalizeText = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/₹/g, " rs ")
    .replace(/rs\./g, " rs ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stemToken = (token) => {
  if (token.length > 4 && token.endsWith("ies")) {
    return `${token.slice(0, -3)}y`;
  }

  if (token.length > 3 && token.endsWith("es")) {
    return token.slice(0, -2);
  }

  if (token.length > 3 && token.endsWith("s")) {
    return token.slice(0, -1);
  }

  return token;
};

const tokenize = (value = "") =>
  normalizeText(value)
    .split(" ")
    .map(stemToken)
    .filter(Boolean);

const getItemSearchText = (item) =>
  [
    item.name,
    item.description,
    item.category?.name,
    ...(Array.isArray(item.tags) ? item.tags : []),
  ]
    .filter(Boolean)
    .join(" ");

const getMenuItemTokens = (item) =>
  tokenize(getItemSearchText(item)).filter((token) => !STOP_WORDS.has(token));

const getNameTokens = (item) =>
  tokenize(item.name).filter((token) => !STOP_WORDS.has(token));

const parseBudget = (query) => {
  const normalized = normalizeText(query);
  const match = normalized.match(
    /(?:under|below|within|upto|up to|less than)\s+(?:rs\s+|rupees\s+|inr\s+)?(\d+)/
  );

  return match ? Number(match[1]) : null;
};

const getQuantityTokenValue = (token) => {
  if (/^\d+$/.test(token)) return Number(token);
  return QUANTITY_WORDS[token] || null;
};

const findFirstNameTokenIndex = (queryTokens, nameTokens) => {
  for (const nameToken of nameTokens) {
    const index = queryTokens.indexOf(nameToken);
    if (index !== -1) return index;
  }

  return -1;
};

const getQuantityForItem = (queryTokens, item) => {
  const nameTokens = getNameTokens(item);
  const firstNameTokenIndex = findFirstNameTokenIndex(queryTokens, nameTokens);

  if (firstNameTokenIndex <= 0) return 1;

  const lookbackStart = Math.max(0, firstNameTokenIndex - 5);
  const nearbyTokens = queryTokens.slice(lookbackStart, firstNameTokenIndex);

  for (let index = nearbyTokens.length - 1; index >= 0; index -= 1) {
    const quantity = getQuantityTokenValue(nearbyTokens[index]);
    if (quantity) return quantity;
  }

  return 1;
};

const hasAllNameTokens = (queryTokenSet, item) => {
  const nameTokens = getNameTokens(item);
  if (nameTokens.length === 0) return false;

  return nameTokens.every((token) => queryTokenSet.has(token));
};

const hasExactNamePhrase = (query, item) => {
  const normalizedQuery = normalizeText(query);
  const normalizedName = normalizeText(item.name);

  return Boolean(normalizedName && normalizedQuery.includes(normalizedName));
};

const hasClearItemIntent = (queryTokens, item) => {
  const nameTokens = getNameTokens(item);
  if (nameTokens.length === 0) return false;

  const queryTokenSet = new Set(queryTokens);
  const matchedCount = nameTokens.filter((token) => queryTokenSet.has(token))
    .length;

  if (nameTokens.length === 1) return matchedCount === 1;
  return matchedCount === nameTokens.length;
};

const getDirectCandidate = (query, queryTokens, item) => {
  const queryTokenSet = new Set(queryTokens);
  const nameTokens = getNameTokens(item);
  const matchedNameTokens = nameTokens.filter((token) =>
    queryTokenSet.has(token)
  );

  if (hasExactNamePhrase(query, item) || hasAllNameTokens(queryTokenSet, item)) {
    return {
      item,
      confidence: 100,
      matchedKey: item._id,
    };
  }

  if (
    matchedNameTokens.length >= 2 &&
    matchedNameTokens.some((token) => token.length >= 4)
  ) {
    return {
      item,
      confidence: 86,
      matchedKey: matchedNameTokens.sort().join("-"),
    };
  }

  const strongToken = matchedNameTokens.find(
    (token) => token.length >= 4 && !["veg", "nonveg"].includes(token)
  );

  if (nameTokens.length <= 2 && strongToken) {
    return {
      item,
      confidence: 70,
      matchedKey: strongToken,
    };
  }

  if (hasClearItemIntent(queryTokens, item)) {
    return {
      item,
      confidence: 80,
      matchedKey: item._id,
    };
  }

  return null;
};

const getQueryTraits = (query, queryTokens) => {
  const queryTokenSet = new Set(queryTokens);

  return {
    budget: parseBudget(query),
    wantsVeg:
      queryTokenSet.has("veg") ||
      queryTokenSet.has("vegetarian") ||
      queryTokenSet.has("veggie"),
    wantsNonVeg:
      queryTokenSet.has("nonveg") ||
      queryTokenSet.has("non") ||
      queryTokenSet.has("chicken") ||
      queryTokenSet.has("meat"),
    wantsSpicy: queryTokens.some((token) => SPICY_WORDS.has(token)),
    wantsDrink: queryTokens.some((token) => DRINK_WORDS.has(token)),
    wantsHealthy: queryTokens.some((token) => HEALTHY_WORDS.has(token)),
    wantsProtein: queryTokens.some((token) => PROTEIN_WORDS.has(token)),
    wantsBudget: queryTokens.some((token) => BUDGET_WORDS.has(token)),
    wantsPremium: queryTokens.some((token) => PREMIUM_WORDS.has(token)),
    wantsKids: queryTokens.some((token) => KIDS_WORDS.has(token)),
    wantsCombo: queryTokens.some((token) => COMBO_WORDS.has(token)),
    wantsVegan: queryTokens.some((token) => VEGAN_WORDS.has(token)),
    wantsSweet: queryTokens.some((token) => SWEET_WORDS.has(token)),
    wantsMild: queryTokens.some((token) => MILD_WORDS.has(token)),
  };
};

const getItemTagSet = (item) =>
  new Set(
    [
      item.category?.name,
      item.spiceLevel,
      ...(Array.isArray(item.tags) ? item.tags : []),
    ]
      .filter(Boolean)
      .flatMap((value) => normalizeText(value).split(" "))
      .filter(Boolean)
  );

const hasAny = (set, values) => values.some((value) => set.has(value));

const scoreSuggestion = (item, queryTokens, traits) => {
  const itemTokens = getMenuItemTokens(item);
  const itemTokenSet = new Set(itemTokens);
  const tagSet = getItemTagSet(item);
  let score = 0;

  queryTokens
    .filter((token) => !STOP_WORDS.has(token))
    .forEach((token) => {
      if (itemTokenSet.has(token)) score += 18;
      if (
        itemTokens.some(
          (itemToken) => itemToken.startsWith(token) || token.startsWith(itemToken)
        )
      ) {
        score += 6;
      }
    });

  if (traits.budget) {
    score += item.price <= traits.budget ? 12 : -35;
  }

  if (traits.wantsBudget) {
    score += item.price <= 250 || tagSet.has("budget") ? 18 : -14;
  }

  if (traits.wantsVeg) {
    score += item.isVeg ? 18 : -45;
  }

  if (traits.wantsNonVeg) {
    score += item.isVeg ? -20 : 14;
  }

  if (traits.wantsSpicy) {
    score +=
      itemTokens.some((token) => SPICY_WORDS.has(token)) ||
      tagSet.has("spicy")
        ? 20
        : -8;
  }

  if (traits.wantsDrink) {
    score += itemTokens.some((token) => DRINK_WORDS.has(token)) ? 18 : -8;
  }

  if (traits.wantsHealthy) {
    score += hasAny(tagSet, ["healthy", "salad", "millet"]) ? 24 : -10;
  }

  if (traits.wantsProtein) {
    score += hasAny(tagSet, ["high", "protein", "gym"]) ? 26 : -10;
  }

  if (traits.wantsPremium) {
    score +=
      hasAny(tagSet, ["premium", "chef", "special", "signature"]) ||
      item.price >= 350
        ? 20
        : -8;
  }

  if (traits.wantsKids) {
    score += hasAny(tagSet, ["kids", "kid", "mini", "mild"]) ? 28 : -12;
    if (tagSet.has("spicy")) score -= 18;
  }

  if (traits.wantsCombo) {
    score +=
      hasAny(tagSet, ["combo", "deal", "family"]) ||
      normalizeText(item.category?.name).includes("combo")
        ? 30
        : -10;
  }

  if (traits.wantsVegan) {
    score += item.isVegan || tagSet.has("vegan") ? 34 : -38;
  }

  if (traits.wantsSweet) {
    score += hasAny(tagSet, ["sweet", "dessert", "chocolate", "kulfi"])
      ? 24
      : -8;
  }

  if (traits.wantsMild) {
    score += hasAny(tagSet, ["mild", "none"]) ? 20 : -12;
  }

  const hasOnlyTraits =
    traits.budget ||
    traits.wantsBudget ||
    traits.wantsVeg ||
    traits.wantsNonVeg ||
    traits.wantsSpicy ||
    traits.wantsDrink ||
    traits.wantsHealthy ||
    traits.wantsProtein ||
    traits.wantsPremium ||
    traits.wantsKids ||
    traits.wantsCombo ||
    traits.wantsVegan ||
    traits.wantsSweet ||
    traits.wantsMild;

  if (hasOnlyTraits && score > -1) score += 6;

  return score;
};

const getSuggestionReason = (item, traits) => {
  const tagSet = getItemTagSet(item);

  if (traits.budget && item.price <= traits.budget) {
    return `Under Rs. ${traits.budget}`;
  }

  if (traits.wantsKids && hasAny(tagSet, ["kids", "mini", "mild"])) {
    return "Kid-friendly and mild";
  }

  if (traits.wantsCombo && hasAny(tagSet, ["combo", "deal", "family"])) {
    return "Complete combo recommendation";
  }

  if (traits.wantsProtein && hasAny(tagSet, ["high", "protein", "gym"])) {
    return "High-protein match";
  }

  if (traits.wantsHealthy && tagSet.has("healthy")) {
    return "Healthy pick";
  }

  if (traits.wantsVegan && (item.isVegan || tagSet.has("vegan"))) {
    return "Vegan menu match";
  }

  if (traits.wantsPremium && hasAny(tagSet, ["premium", "chef", "special"])) {
    return "Premium dinner pick";
  }

  if (traits.wantsSpicy && tagSet.has("spicy")) {
    return "Spicy and popular";
  }

  if (traits.wantsBudget && (item.price <= 250 || tagSet.has("budget"))) {
    return "Smart budget pick";
  }

  if (traits.wantsSweet && hasAny(tagSet, ["sweet", "dessert"])) {
    return "Dessert lover pick";
  }

  return "Closest menu match";
};

const getClosestSuggestions = (query, menuItems, limit = 4) => {
  const availableItems = menuItems.filter((item) => item.isAvailable !== false);
  const queryTokens = tokenize(query);
  const traits = getQueryTraits(query, queryTokens);

  return availableItems
    .map((item) => ({
      item,
      score: scoreSuggestion(item, queryTokens, traits),
      reason: getSuggestionReason(item, traits),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.price - b.item.price)
    .slice(0, limit)
    .map(({ item, reason }) => ({ item, reason }));
};

const localFallbackParse = (query, menuItems) => {
  const availableItems = menuItems.filter((item) => item.isAvailable !== false);
  const queryTokens = tokenize(query);

  const directCandidates = availableItems
    .map((item) => getDirectCandidate(query, queryTokens, item))
    .filter(Boolean);

  const duplicateMatchKeys = new Set(
    directCandidates
      .map((candidate) => candidate.matchedKey)
      .filter(
        (matchedKey, index, allKeys) =>
          allKeys.indexOf(matchedKey) !== index && matchedKey
      )
  );

  const cartItems = directCandidates
    .filter(
      (candidate) =>
        candidate.confidence >= 100 ||
        !duplicateMatchKeys.has(candidate.matchedKey)
    )
    .map(({ item }) => ({
      item,
      quantity: getQuantityForItem(queryTokens, item),
      reason: "Matched from your menu",
    }));

  if (cartItems.length > 0) {
    return {
      status: "cart",
      provider: "local-fallback",
      cartItems,
      suggestions: [],
      message: `Lovely choice. I added ${cartItems.length} menu item${
        cartItems.length > 1 ? "s" : ""
      } to your cart with the right quantity.`,
    };
  }

  const suggestions = getClosestSuggestions(query, availableItems);

  if (suggestions.length > 0) {
    return {
      status: "suggestions",
      provider: "local-fallback",
      cartItems: [],
      suggestions,
      message:
        "I found a few thoughtful matches from the real menu. Pick one and I will add it to your cart.",
    };
  }

  return {
    status: "empty",
    provider: "local-fallback",
    cartItems: [],
    suggestions: [],
    message:
      "I did not find a confident match yet. Try a dish name, cuisine mood, or budget.",
  };
};

const normalizeRemoteResult = (result, menuItems) => {
  const menuById = new Map(menuItems.map((item) => [item._id, item]));
  const menuByName = new Map(
    menuItems.map((item) => [normalizeText(item.name), item])
  );

  const cartItems = (result.cartItems || [])
    .map((entry) => {
      const item =
        menuById.get(entry.id || entry.menuItem || entry._id) ||
        menuByName.get(normalizeText(entry.name));

      if (!item || item.isAvailable === false) return null;

      return {
        item,
        quantity: Math.max(1, Number(entry.quantity) || 1),
        reason: entry.reason || "AI matched this menu item",
      };
    })
    .filter(Boolean);

  const suggestions = (result.suggestions || [])
    .map((entry) => {
      const item =
        menuById.get(entry.id || entry.menuItem || entry._id) ||
        menuByName.get(normalizeText(entry.name));

      if (!item || item.isAvailable === false) return null;

      return {
        item,
        reason: entry.reason || "AI suggestion",
      };
    })
    .filter(Boolean);

  return {
    status: cartItems.length > 0 ? "cart" : suggestions.length ? "suggestions" : "empty",
    provider: "ai-endpoint",
    cartItems,
    suggestions,
    message:
      result.message ||
      (cartItems.length > 0
        ? "Perfect, I matched that with real menu items."
        : "These options feel closest to what you asked for."),
  };
};

export const buildOrderFromText = async ({ query, menuItems }) => {
  const cleanQuery = query?.trim();

  if (!cleanQuery) {
    return {
      status: "empty",
      provider: "local-fallback",
      cartItems: [],
      suggestions: [],
      message:
        "Tell me what you are craving and I will guide you from the menu.",
    };
  }

  if (!Array.isArray(menuItems) || menuItems.length === 0) {
    return {
      status: "empty",
      provider: "local-fallback",
      cartItems: [],
      suggestions: [],
      message:
        "The menu is still warming up. Please try again in a moment.",
    };
  }

  const aiEndpoint = import.meta.env.VITE_AI_ORDER_ENDPOINT;

  if (aiEndpoint) {
    try {
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: cleanQuery,
          menuItems: menuItems.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            isVeg: item.isVeg,
            isVegan: item.isVegan,
            isAvailable: item.isAvailable,
            category: item.category?.name,
            tags: item.tags || [],
            spiceLevel: item.spiceLevel,
          })),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return normalizeRemoteResult(result, menuItems);
      }
    } catch {
      // Local fallback keeps ordering usable when the AI endpoint is unavailable.
    }
  }

  return localFallbackParse(cleanQuery, menuItems);
};
