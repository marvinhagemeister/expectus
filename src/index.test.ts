import { strict as assert } from "assert";
import * as sinon from "sinon";
import { expect } from ".";

describe("Assertion", () => {
  describe(".equal()", () => {
    it("supports .equal", () => {
      expect(true).equal(true);

      assert.throws(() => {
        expect(true).equal(false);
      });
    });

    it("supports .not.equal", () => {
      expect(true).not.equal(false);

      assert.throws(() => {
        expect(true).not.equal(true);
      });
    });

    it("supports .eq shorthand", () => {
      expect(true).eq(true);

      assert.throws(() => {
        expect(true).eq(false);
      });
    });

    it("supports .equals shorthand", () => {
      expect(true).equals(true);

      assert.throws(() => {
        expect(true).equals(false);
      });
    });

    it("works with property", () => {
      assert.doesNotThrow(() => {
        expect({ foo: 1 }).to.have.property("foo").that.equals(1);
      });
    });

    describe.skip(".deep", () => {
      it("supports objects", () => {
        assert.doesNotThrow(() => {
          expect({ a: 1 }).deep.equal({ a: 1 });
        });
        assert.throws(() => {
          expect({}).deep.equal({ a: 1 });
        });
      });

      it("supports arrays", () => {
        assert.doesNotThrow(() => {
          expect([1, 2]).deep.equal([1, 2]);
        });
        assert.throws(() => {
          expect([] as any).deep.equal([1]);
        });
      });

      it("supports mixed", () => {
        assert.doesNotThrow(() => {
          expect([1, { a: [1] }]).deep.equal([1, { a: [1] }]);
        });
        assert.throws(() => {
          expect([1, { a: [1] }]).deep.equal([1, { a: [2] }]);
        });
        assert.throws(() => {
          expect([1, { a: [1], b: 1 }] as any).deep.equal([1, { a: [1] }]);
        });
      });

      // FIXME: not

      it("supports .eql shorthand", () => {
        expect({ foo: [1] }).eql({ foo: [1] });

        assert.throws(() => {
          expect({ foo: [1] }).eql({ foo: [1, 2] });
        });
      });
    });
  });

  describe.skip(".throw", () => {
    it("supports .throw", () => {
      assert.throws(() => {
        expect(true).throw();
      });

      assert.doesNotThrow(() => {
        expect(() => {
          throw new Error("fail");
        }).throw();
      });
    });

    it("supports .not.throw", () => {
      assert.throws(() => {
        expect(true).not.throw();
      });

      assert.throws(() => {
        expect(() => {
          throw new Error("fail");
        }).not.throw();
      });
      assert.doesNotThrow(() => {
        expect(() => null).not.throw();
      });
    });

    it("supports RegExp matcher", () => {
      assert.throws(() => {
        expect(() => {
          throw new Error("fail");
        }).throw(/foo/);
      });

      assert.doesNotThrow(() => {
        expect(() => {
          throw new Error("fail");
        }).throw(/fail/);
      });
    });

    it("supports .not RegExp matcher", () => {
      assert.throws(() => {
        expect(() => {
          throw new Error("fail");
        }).not.throw(/fail/);
      });
      assert.doesNotThrow(() => {
        expect(() => {
          throw new Error("fail");
        }).not.throw(/foo/);
      });
    });
  });

  describe(".exist", () => {
    it("supports .exist", () => {
      assert.throws(() => {
        expect(null).exist;
      });
      assert.throws(() => {
        expect(undefined).exist;
      });

      assert.doesNotThrow(() => {
        expect(1).exist;
      });
    });

    it("supports .not.exist", () => {
      assert.doesNotThrow(() => {
        expect(null).not.exist;
      });
      assert.doesNotThrow(() => {
        expect(undefined).not.exist;
      });

      assert.throws(() => {
        expect(1).not.exist;
      });
    });
  });

  describe(".false", () => {
    it("supports .false", () => {
      assert.throws(() => {
        expect(null).false;
      });
      assert.throws(() => {
        expect(true).false;
      });

      assert.doesNotThrow(() => {
        expect(false).false;
      });
    });

    it("supports .not.false", () => {
      assert.doesNotThrow(() => {
        expect(null).not.false;
      });
      assert.doesNotThrow(() => {
        expect(true).not.false;
      });

      assert.throws(() => {
        expect(false).not.false;
      });
    });
  });

  describe(".true", () => {
    it("supports .true", () => {
      assert.throws(() => {
        expect(null).true;
      });
      assert.throws(() => {
        expect(false).true;
      });

      assert.doesNotThrow(() => {
        expect(true).true;
      });
    });

    it("supports .not.true", () => {
      assert.doesNotThrow(() => {
        expect(null).not.true;
      });
      assert.throws(() => {
        expect(true).not.true;
      });

      assert.doesNotThrow(() => {
        expect(false).not.true;
      });
    });
  });

  describe(".null", () => {
    it("supports .null", () => {
      assert.throws(() => {
        expect(true).null;
      });
      assert.throws(() => {
        expect(undefined).null;
      });

      assert.doesNotThrow(() => {
        expect(null).null;
      });
    });

    it("supports .not.null", () => {
      assert.doesNotThrow(() => {
        expect(undefined).not.null;
      });
      assert.throws(() => {
        expect(null).not.null;
      });

      assert.doesNotThrow(() => {
        expect("null").not.null;
      });
    });
  });

  describe(".undefined", () => {
    it("supports .undefined", () => {
      assert.throws(() => {
        expect(true).undefined;
      });
      assert.throws(() => {
        expect(null).undefined;
      });

      assert.doesNotThrow(() => {
        expect(undefined).undefined;
      });
    });

    it("supports .not.undefined", () => {
      assert.doesNotThrow(() => {
        expect(null).not.undefined;
      });
      assert.throws(() => {
        expect(undefined).not.undefined;
      });

      assert.doesNotThrow(() => {
        expect("undefined").not.undefined;
      });
    });
  });

  describe(".a()/.an()", () => {
    it("supports .an()", () => {
      assert.throws(() => {
        expect(null).an("number");
      });
      assert.throws(() => {
        expect("true").an("boolean");
      });

      assert.doesNotThrow(() => {
        expect(1).an("number");
      });
    });

    it("supports .not.an()", () => {
      assert.doesNotThrow(() => {
        expect(null).not.an("number");
      });
      assert.doesNotThrow(() => {
        expect("true").not.an("boolean");
      });

      assert.throws(() => {
        expect(1).not.an("number");
      });
    });

    it("supports .a()", () => {
      assert.throws(() => {
        expect(null).a("number");
      });
      assert.throws(() => {
        expect("true").a("boolean");
      });

      assert.doesNotThrow(() => {
        expect(1).a("number");
      });
    });

    it("supports arrays", () => {
      assert.doesNotThrow(() => {
        expect([]).a("array");
      });
    });

    it("works with .property", () => {
      assert.doesNotThrow(() => {
        expect({ foo: 1 }).property("foo").a("number");
      });
    });

    it("supports constructors", () => {
      class Foo {}
      expect(new Foo()).a("Foo");
    });
  });

  describe(".haveOwnProperty()", () => {
    it("supports .haveOwnProperty()", () => {
      assert.throws(() => {
        expect(null).haveOwnProperty("numberfoo");
      });
      assert.throws(() => {
        expect({}).haveOwnProperty("foo");
      });

      assert.doesNotThrow(() => {
        expect({ foo: 1 }).haveOwnProperty("foo");
      });
    });

    it("supports .not.haveOwnProperty()", () => {
      assert.throws(() => {
        expect(null).not.haveOwnProperty("numberfoo");
      });
      assert.doesNotThrow(() => {
        expect({}).not.haveOwnProperty("foo");
      });

      assert.throws(() => {
        expect({ foo: 1 }).not.haveOwnProperty("foo");
      });
    });
  });

  describe("property()", () => {
    it("supports values", () => {
      assert.throws(() => {
        expect(null).property("foo", 1);
      });
      assert.throws(() => {
        expect({ foo: 1 }).property("bar", 1);
      });
      assert.throws(() => {
        expect({ foo: 1 }).property("foo", 2);
      });

      assert.doesNotThrow(() => {
        expect({ foo: 1 }).property("foo", 1);
      });
    });

    it("supports without value", () => {
      assert.throws(() => {
        expect({ bar: 1 }).property("foo");
      });

      assert.doesNotThrow(() => {
        expect({ foo: 1 }).property("foo");
      });
    });

    it("supports .not values", () => {
      assert.doesNotThrow(() => {
        expect({ foo: 1 }).not.property("bar", 1);
      });
      assert.doesNotThrow(() => {
        expect({ foo: 1 }).not.property("foo", 2);
      });

      assert.throws(() => {
        expect({ foo: 1 }).not.property("foo", 1);
      });
    });

    it("supports .not without value", () => {
      assert.doesNotThrow(() => {
        expect({ bar: 1 }).not.property("foo");
      });

      assert.throws(() => {
        expect({ foo: 1 }).not.property("foo");
      });
    });

    it("supports .nested.property()", () => {
      assert.doesNotThrow(() => {
        expect({ foo: { bar: 1 } }).nested.property("foo.bar", 1);
      });

      assert.doesNotThrow(() => {
        expect({ foo: [{ bar: 1 }] }).nested.property("foo[0].bar", 1);
      });
    });

    it("supports chaining", () => {
      assert.doesNotThrow(() => {
        expect({ foo: { bar: undefined } })
          .property("foo")
          .property("bar")
          .not.property("bob");
      });
    });
  });

  describe.skip(".keys()", () => {
    it("supports .keys()", () => {
      assert.throws(() => {
        expect(false).keys(["1"]);
      });
      assert.throws(() => {
        expect({ foo: 1 }).keys(["bar"]);
      });
      assert.throws(() => {
        expect({ foo: 1, bar: 2 }).keys(["bar"]);
      });

      assert.doesNotThrow(() => {
        expect({ foo: 1 }).keys(["foo"]);
      });
      assert.doesNotThrow(() => {
        expect({ foo: 1, bar: 2 }).keys(["foo", "bar"]);
      });
    });

    it("supports .not.keys()", () => {
      assert.throws(() => {
        expect(false).not.keys(["1"]);
      });
      assert.doesNotThrow(() => {
        expect({ foo: 1 }).not.keys(["bar"]);
      });
      assert.doesNotThrow(() => {
        expect({ foo: 1, bar: 2 }).not.keys(["bar"]);
      });

      assert.throws(() => {
        expect({ foo: 1 }).not.keys(["foo"]);
      });
      assert.throws(() => {
        expect({ foo: 1, bar: 2 }).not.keys(["foo", "bar"]);
      });
    });

    it("supports .any.keys()", () => {
      assert.doesNotThrow(() => {
        expect({ foo: 1, bar: 123 }).any.keys(["bar"]);
      });
    });

    it("supports .any.all.keys()", () => {
      assert.doesNotThrow(() => {
        expect({ foo: 1 }).any.all.keys(["foo"]);
      });
      assert.throws(() => {
        expect({ foo: 1, bar: 2 }).keys(["bar"]);
      });
    });
  });

  describe(".instanceof()", () => {
    it("supports .instanceof", () => {
      assert.doesNotThrow(() => {
        expect(new Array()).instanceof(Array);
      });

      assert.throws(() => {
        expect(new Array()).instanceof(Map);
      });
    });

    it("supports .not.instanceof", () => {
      assert.throws(() => {
        expect(new Array()).not.instanceof(Array);
      });

      assert.doesNotThrow(() => {
        expect(new Array()).not.instanceof(Map);
      });
    });

    it("supports .instanceOf alias", () => {
      assert.doesNotThrow(() => {
        expect(new Array()).instanceOf(Array);
      });

      assert.throws(() => {
        expect(new Array()).instanceOf(Map);
      });
    });
  });

  describe(".match()", () => {
    it("supports .match", () => {
      assert.doesNotThrow(() => {
        expect("foo").match(/foo/);
      });

      assert.throws(() => {
        expect("foo").match(/foobar/);
      });
    });

    it("supports .not.match", () => {
      assert.throws(() => {
        expect("foo").not.match(/foo/);
      });

      assert.doesNotThrow(() => {
        expect("foo").not.match(/foobar/);
      });
    });
  });

  describe(".include()", () => {
    it("supports .include", () => {
      assert.doesNotThrow(() => {
        expect("foo").include("foo");
      });
      assert.doesNotThrow(() => {
        expect([1]).include(1);
      });

      assert.throws(() => {
        expect("foo").include("foobar");
      });
      assert.throws(() => {
        expect([1]).include(2);
      });
    });

    it("supports .not.include", () => {
      assert.throws(() => {
        expect("foo").not.include("foo");
      });
      assert.throws(() => {
        expect([1]).not.include(1);
      });

      assert.doesNotThrow(() => {
        expect("foo").not.include("foobar");
      });
      assert.doesNotThrow(() => {
        expect([1]).not.include(2);
      });
    });

    it("supports .includes shorthand", () => {
      assert.doesNotThrow(() => {
        expect("foo").includes("foo");
      });
      assert.doesNotThrow(() => {
        expect([1]).includes(1);
      });

      assert.throws(() => {
        expect("foo").includes("foobar");
      });
      assert.throws(() => {
        expect([1]).includes(2);
      });
    });

    it("supports .contain shorthand", () => {
      assert.doesNotThrow(() => {
        expect("foo").contain("foo");
      });
      assert.doesNotThrow(() => {
        expect([1]).contain(1);
      });

      assert.throws(() => {
        expect("foo").contain("foobar");
      });
      assert.throws(() => {
        expect([1]).contain(2);
      });
    });

    it("supports .contains shorthand", () => {
      assert.doesNotThrow(() => {
        expect("foo").contains("foo");
      });
      assert.doesNotThrow(() => {
        expect([1]).contains(1);
      });

      assert.throws(() => {
        expect("foo").contains("foobar");
      });
      assert.throws(() => {
        expect([1]).contains(2);
      });
    });
  });

  describe(".lengthOf()", () => {
    it("supports .lengthOf", () => {
      assert.doesNotThrow(() => {
        expect("aa").lengthOf(2);
      });
      assert.doesNotThrow(() => {
        expect([1]).lengthOf(1);
      });

      assert.throws(() => {
        expect("aa").lengthOf(3);
      });
      assert.throws(() => {
        expect([]).lengthOf(2);
      });
    });

    it("supports .not.lengthOf", () => {
      assert.throws(() => {
        expect("aa").not.lengthOf(2);
      });
      assert.throws(() => {
        expect([1]).not.lengthOf(1);
      });

      assert.doesNotThrow(() => {
        expect("aa").not.lengthOf(3);
      });
      assert.doesNotThrow(() => {
        expect([]).not.lengthOf(2);
      });
    });

    it("supports .length shorthand", () => {
      assert.doesNotThrow(() => {
        expect("aa").length(2);
      });
      assert.doesNotThrow(() => {
        expect([1]).length(1);
      });

      assert.throws(() => {
        expect("aa").length(3);
      });
      assert.throws(() => {
        expect([]).length(2);
      });
    });
  });

  describe(".below()", () => {
    it("supports .below", () => {
      assert.doesNotThrow(() => {
        expect(10).below(100);
      });
      assert.doesNotThrow(() => {
        expect(-1).below(0);
      });

      assert.throws(() => {
        expect(1).below(0);
      });
      assert.throws(() => {
        expect(10).below(2);
      });
    });

    it("supports .not.below", () => {
      assert.throws(() => {
        expect(10).not.below(100);
      });
      assert.throws(() => {
        expect(-2).not.below(-1);
      });

      assert.doesNotThrow(() => {
        expect(1).not.below(0);
      });
      assert.doesNotThrow(() => {
        expect(10).not.below(2);
      });
    });
  });

  describe("sinon-chai", () => {
    describe(".called", () => {
      it("supports .called", () => {
        assert.throws(() => {
          expect(true).called;
        });

        const spy = sinon.spy();
        assert.throws(() => {
          expect(spy).called;
        });

        spy();

        assert.doesNotThrow(() => {
          expect(spy).called;
        });
      });

      it("supports .not.called", () => {
        assert.throws(() => {
          expect(true).not.called;
        });

        const spy = sinon.spy();
        assert.doesNotThrow(() => {
          expect(spy).not.called;
        });

        spy();

        assert.throws(() => {
          expect(spy).not.called;
        });
      });
    });

    describe(".callCount()", () => {
      it("supports .callCount()", () => {
        assert.throws(() => {
          expect(true).callCount(1);
        });

        const spy = sinon.spy();
        assert.throws(() => {
          expect(spy).callCount(1);
        });

        spy();

        assert.doesNotThrow(() => {
          expect(spy).callCount(1);
        });
      });

      it("supports .not.callCount()", () => {
        const spy = sinon.spy();
        assert.doesNotThrow(() => {
          expect(spy).not.callCount(1);
        });

        spy();

        assert.throws(() => {
          expect(spy).not.callCount(1);
        });
      });
    });

    describe(".calledOnce", () => {
      it("supports .calledOnce", () => {
        assert.throws(() => {
          expect(true).calledOnce;
        });

        const spy = sinon.spy();
        assert.throws(() => {
          expect(spy).calledOnce;
        });

        spy();

        assert.doesNotThrow(() => {
          expect(spy).calledOnce;
        });

        spy();
        assert.throws(() => {
          expect(spy).calledOnce;
        });
      });

      it("supports .not.calledOnce", () => {
        assert.throws(() => {
          expect(true).not.calledOnce;
        });

        const spy = sinon.spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledOnce;
        });

        spy();

        assert.throws(() => {
          expect(spy).not.calledOnce;
        });

        spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledOnce;
        });
      });
    });

    describe(".calledTwice", () => {
      it("supports .calledTwice", () => {
        assert.throws(() => {
          expect(true).calledTwice;
        });

        const spy = sinon.spy();
        assert.throws(() => {
          expect(spy).calledTwice;
        });

        spy();

        assert.throws(() => {
          expect(spy).calledTwice;
        });

        spy();
        assert.doesNotThrow(() => {
          expect(spy).calledTwice;
        });
        spy();
        assert.throws(() => {
          expect(spy).calledTwice;
        });
      });

      it("supports .not.calledTwice", () => {
        assert.throws(() => {
          expect(true).not.calledTwice;
        });

        const spy = sinon.spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledTwice;
        });

        spy();

        assert.doesNotThrow(() => {
          expect(spy).not.calledTwice;
        });

        spy();
        assert.throws(() => {
          expect(spy).not.calledTwice;
        });
        spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledTwice;
        });
      });
    });

    describe(".calledThrice", () => {
      it("supports .calledThrice", () => {
        assert.throws(() => {
          expect(true).calledThrice;
        });

        const spy = sinon.spy();
        assert.throws(() => {
          expect(spy).calledThrice;
        });

        spy();

        assert.throws(() => {
          expect(spy).calledThrice;
        });

        spy();
        assert.throws(() => {
          expect(spy).calledThrice;
        });

        spy();
        assert.doesNotThrow(() => {
          expect(spy).calledThrice;
        });

        spy();
        assert.throws(() => {
          expect(spy).calledThrice;
        });
      });

      it("supports .not.calledThrice", () => {
        assert.throws(() => {
          expect(true).not.calledThrice;
        });

        const spy = sinon.spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledThrice;
        });

        spy();

        assert.doesNotThrow(() => {
          expect(spy).not.calledThrice;
        });

        spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledThrice;
        });

        spy();
        assert.throws(() => {
          expect(spy).not.calledThrice;
        });

        spy();
        assert.doesNotThrow(() => {
          expect(spy).not.calledThrice;
        });
      });
    });

    // FIXME:
    describe(".calledWith", () => {
      it("supports .calledWith", () => {});
      it("supports .not.calledWith", () => {});
    });

    describe(".calledWithExactly", () => {
      it("supports .calledWithExactly", () => {});
      it("supports .not.calledWithExactly", () => {});
    });

    describe(".calledOnceWith", () => {
      it("supports .calledOnceWith", () => {});
      it("supports .not.calledOnceWith", () => {});
    });

    describe(".calledWithMatch", () => {
      it("supports .calledWithMatch", () => {});
      it("supports .not.calledWithMatch", () => {});
    });

    describe(".calledBefore", () => {
      it("supports .calledBefore", () => {});
      it("supports .not.calledBefore", () => {});
    });

    describe(".returned", () => {
      it("supports .returned", () => {});
      it("supports .not.returned", () => {});
    });
  });

  describe(".and", () => {
    it("pass through", () => {
      expect(true).and.equal(true);

      assert.throws(() => {
        expect(true).and.equal(false);
      });
    });

    it("reset deep flag", () => {
      assert.throws(() => {
        expect({}).deep.equal({}).and.equal({});
      });
    });

    it("reset not flag", () => {
      assert.doesNotThrow(() => {
        expect(1).not.equal(2).and.equal(1);
      });
    });
  });

  describe("pass-through", () => {
    it("supports .that", () => {
      expect(true).that.equal(true);

      assert.throws(() => {
        expect(true).that.equal(false);
      });
    });

    it("supports .is", () => {
      expect(true).is.equal(true);

      assert.throws(() => {
        expect(true).is.equal(false);
      });
    });

    it("supports .to", () => {
      expect(true).to.equal(true);

      assert.throws(() => {
        expect(true).to.equal(false);
      });
    });

    it("supports .be", () => {
      expect(true).be.equal(true);

      assert.throws(() => {
        expect(true).be.equal(false);
      });
    });

    it("supports .have", () => {
      expect(true).have.equal(true);

      assert.throws(() => {
        expect(true).have.equal(false);
      });
    });

    it("supports .been", () => {
      expect(true).been.equal(true);

      assert.throws(() => {
        expect(true).been.equal(false);
      });
    });

    it("supports .with", () => {
      expect(true).with.equal(true);

      assert.throws(() => {
        expect(true).with.equal(false);
      });
    });

    it("supports .does", () => {
      expect(true).does.equal(true);

      assert.throws(() => {
        expect(true).does.equal(false);
      });
    });
  });

  it("should support messages", () => {
    try {
      expect([1, 2]).lengthOf(3);
    } catch (e) {
      assert.equal(
        e.message,
        "Expected Array(2) to have a length of 3, but got 2 instead."
      );
    }
  });
});
