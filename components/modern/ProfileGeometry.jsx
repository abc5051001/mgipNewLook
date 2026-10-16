// Quiet drawings sit in the panel headers, leaving the reading area clear.
export default function ProfileGeometry({ type }) {
  return <svg className="mg-profile-geometry" viewBox="0 0 160 160" fill="none" aria-hidden="true">
    {type === 'bar' ? <>
      <circle cx="88" cy="72" r="53"/><circle cx="88" cy="72" r="37"/>
      <path d="M35 72H141M88 19V125M23 112V142H53M117 12H148V43"/>
    </> : type === 'education' ? <>
      <path d="M29 42L83 13L137 42V106L83 137L29 106ZM29 42L83 74L137 42M83 74V137"/>
      <path d="M45 52L83 31L121 52V96L83 118L45 96ZM45 52L83 74L121 52"/>
    </> : type === 'experience' ? <>
      <path d="M36 22H110L135 47V130H36ZM110 22V47H135M50 60H119M50 74H119M50 88H109M50 102H119"/>
      <path d="M25 39H17V144H115V137"/>
    </> : type === 'awards' ? <>
      <path d="M40 24H122V104H40ZM50 34H112V94H50M67 104L61 140L81 129L101 140L95 104"/>
      <path d="M81 43L103 64L81 86L59 64ZM81 54L92 64L81 75L70 64Z"/>
    </> : <>
      <path d="M83 12L145 74L83 136L21 74ZM83 34L123 74L83 114L43 74ZM83 55L102 74L83 93L64 74Z"/>
      <path d="M12 126H42M27 111V141M132 11V31M122 21H142"/>
    </>}
  </svg>;
}
