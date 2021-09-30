import React from 'react'

import { render  } from "@testing-library/react"


test("test grid", async () => {
    const div = render( <div>123</div>)
    expect(div).toMatchSnapshot()
})