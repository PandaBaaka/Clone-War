/*
 * The MIT License
 *
 * Copyright 2017 Tim Boudreau.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package com.mastfrog.jackson;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * By default, Jackson serializes locales using Java constant names, so the
 * hyphens in the ISO standard are replaced with underscores, breaking
 * cross-language portability. This on-by-default serializer ensures they are
 * serialized correctly both as keys and values.
 *
 * @author Tim Boudreau
 * @deprecated implementation moved to jackson-configurers library
 */
@SuppressWarnings("deprecation")
@Deprecated
public final class LocaleJacksonConfigurer implements com.mastfrog.jackson.JacksonConfigurer {

    private final com.mastfrog.jackson.configuration.impl.LocaleJacksonConfigurer delegate
            = new com.mastfrog.jackson.configuration.impl.LocaleJacksonConfigurer();

    @Override
    public ObjectMapper configure(ObjectMapper om) {
        return delegate.configure(om);
    }

    @Override
    public String toString() {
        return "LJC(" + delegate + ")";
    }

    @Override
    public String name() {
        return delegate.name();
    }

}
