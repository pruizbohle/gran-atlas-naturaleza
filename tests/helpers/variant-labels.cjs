exports.normalizedRecord=sp=>({...sp,special:[...new Set(sp.special.map(v=>/^leucístic[oa]$/i.test(v)?'Albino':/^melánic[oa]$/i.test(v)?'Melánico':v))]});
