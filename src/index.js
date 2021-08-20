var b = {
	run(c, args, nr = false) {
		let printed = true;
		if (!nr) {
			b.args = args;
			b.tape = args || [0];
			printed = false;
		} else {
			c = c
				.split('')
				.map(
					e =>
						e.charCodeAt() > 7
							? e.charCodeAt().toString(16)
							: 0 + e.charCodeAt().toString(16)
				)
				.join('');
		}
		c = c.toLowerCase().split``;

		for (let n = 0; n < c.length; n += 2) {
			b.tape[b.ptr] = b.tape[b.ptr] === undefined ? 0 : b.tape[b.ptr];
			function cset(val, ind) {
				//set cell
				ind = ind || b.ptr;
				b.tape[ind] = val;
			}
			function p() {
				let e = b.p;
				b.p = [];
				return e;
			}
			let toSkip = 0;
			let skip = e => (toSkip += e);
			let cm = e => c[n + (e || 0)];
			let H = parseInt(cm(1), 16),
				cr = b.tape[b.ptr];
			//string of if's, descending order
			if (cm() == 'f') {
				//declare array/load arg based on 5th bit
				if (H >= 8) {
					//argument (might remove and replace with more efficient system)
					b.tape[b.ptr] = b.args[cm(1) - 8];
				} else {
					//array
					let arr = b.array(
						c,
						n + 2,
						c.slice(n + 2, n + 2 + (H + 1) * 2),
						skip
					);
					cset(arr);
					skip(H + 1 - 1);
				}
			}
			if (cm() == 'e') {
				//number short
				if (H > 7) {
					//negative
					let nm = -parseInt(c.slice(n + 2, n + 2 + (H - 7) * 2).join(''), 16);
					cset(nm);
				} else {
					//positive
					let nm = parseInt(c.slice(n + 2, n + 2 + (H + 1) * 2).join(''), 16);
					cset(nm);
					skip((H + 1) * 2);
				}
			}
			if (cm() == 'd') {
				//string
				//would be nice if it had a compression thingy
				let e = c.slice(n + 2, n + 2 + (H + 1) * 2),
					res = '';
				for (let h = 0; h < e.length; h += 2) {
					res += String.fromCharCode(parseInt(e[h] + e[h + 1], 16));
				}
				skip(res.length * 2);
				cset(res);
			}
			if (cm() == 'c') {
				//inline numbers, 1 to 16
				cset(H + 1);
			}
			if (cm() == 5) {
				//logic
				if (H == 0) {
					if (cr) {
						b.run(b.p.pop(), [0], true);
					} else {
						b.ptr++;
						cset(1);
					}
				} //if
			}
			if (cm() == 4) {
				//extension of block 0
				if (H == 0) {
					//print
					console.log(cr);
					printed = true;
				}
				if (H == 1) {
					//print without newline
					process.stdout.write(cr);
					printed = true;
				}
				if (H == 2) b.run('01' + cr + '02', [0], true);
				if (H == 3) n = cr - 2; //test, move pointer
				if (H == 4) {
					//adaptive max
					if (typeof cr == 'object') {
						cset(Math.max(...cr));
					} else {
						b.ptr--;
						cset(Math.max(b.tape[b.ptr], b.tape[b.ptr + 1]));
						b.ptr++;
						cset(0);
						b.ptr--;
					}
				}
				if (H == 5) {
					//adaptive min
					if (typeof cr == 'object') {
						cset(Math.min(...cr));
					} else {
						b.ptr--;
						cset(Math.min(b.tape[b.ptr], b.tape[b.ptr + 1]));
						b.ptr++;
						cset(0);
						b.ptr--;
					}
				}
			}
			if (cm() == 3) {
				//array operations, some work on strings
				if (H == 0) cset(cr.map(e => String.fromCharCode(e)).join``); //toString
				if (H == 1) cset(cr[0]); //first item
				if (H == 2) cset(cr[cr.length - 1]); //last item
				if (H == 3) {
					cr.forEach((e, n) => {
						let pr = b.ptr;
						b.ptr++;
						cset(n);
						b.ptr++;
						cset(e);
						b.ptr++;
						b.run(b.p[0], [0], true);
						b.ptr = pr;
					});
				} //forEach
				if (H == 4) cset(cr.reduce((a, b) => a + b)); //sum
			}
			if (cm() == 2) {
				//string operations
				if (H == 0) cset(cr.split``); //to array
				if (H == 1) cset(cr.slice(...p())); //slice
				if (H == 2) cset(cr.charCodeAt(p()[0])); //gets charCode
				if (H == 3) {
					//split by nth character
					let a = [],
						h = p()[0];
					cr.split('').forEach((e, n) => {
						if (n % h == 0) a.push('');
						a[a.length - 1] += e;
					});
					cset(a);
				}
				if (H == 4) cset(parseInt(cr, 2)); //binary
				if (H == 5) cset(parseInt(cr, 16)); //hex
				if (H == 6) cset(parseInt(cr, 8)); //octal
				if (H == 7) cset(cr.toUpperCase());
				if (H == 8) cset(cr.toLowerCase());
				if (H == 9) cset();
			}
			if (cm() == 1) {
				//number operations
				if (H == 0) cset(-b.tape[b.ptr]);
				if (H == 1) cset(b.tape[b.ptr] + ''); //toString
				if (H == 2) cset(Math.abs(b.tape[b.ptr]));
				if (H == 3) cset(Math.floor(b.tape[b.ptr]));
				if (H == 4) cset(Math.ceil(b.tape[b.ptr]));
				if (H == 5) cset(Math.sin(b.tape[b.ptr]));
				if (H == 6) cset(Math.cos(b.tape[b.ptr]));
				if (H == 7) cset(Math.sqrt(b.tape[b.ptr]));
				if (H == 8) cset(Math.random() * b.tape[b.ptr]); //random number from 0 to cell
				if (H == 9) cset(cr.toString(2)); //binary
				if (H == 10) cset(cr.toString(16)); //hex
				if (H == 11) cset(cr.toString(8)); //octal
				//
			}
			if (cm() == 0) {
				//basic tape/code commands
				//null bytes are ignored for now
				if (H == 1) b.ptr++; //move right
				if (H == 2) b.ptr--; //move left
				if (H == 3) cset(0); //reset
				if (H == 4) cset(b.ptr); //pointer value
				if (H == 5) b.tape[b.ptr]++; //increment
				if (H == 6) b.tape[b.ptr]--; //decrement
				if (H == 7) c[n] = String(b.tape[b.ptr]); //sets a part of the code to the cell value (?)
				if (H == 8) {
					//add
					b.ptr--;
					cset(b.tape[b.ptr] + b.tape[b.ptr + 1]);
					b.ptr++;
					cset(0);
					b.ptr--;
				}
				if (H == 9) {
					//subtract
					b.ptr--;
					cset(b.tape[b.ptr] - b.tape[b.ptr + 1]);
					b.ptr++;
					cset(0);
					b.ptr--;
				}
				if (H == 0xa) {
					//multiply
					b.ptr--;
					cset(b.tape[b.ptr] * b.tape[b.ptr + 1]);
					b.ptr++;
					cset(0);
					b.ptr--;
				}
				if (H == 0xb) {
					//divide
					b.ptr--;
					cset(b.tape[b.ptr] / b.tape[b.ptr + 1]);
					b.ptr++;
					cset(0);
					b.ptr--;
				}
				if (H == 0xc) {
					//power
					b.ptr--;
					cset(b.tape[b.ptr] ** b.tape[b.ptr + 1]);
					b.ptr++;
					cset(0);
					b.ptr--;
				}
				if (H == 0xd) {
					//modulo
					b.ptr--;
					cset(b.tape[b.ptr] % b.tape[b.ptr + 1]);
					b.ptr++;
					cset(0);
					b.ptr--;
				}
				if (H == 0xe) {
					//duplicate
					b.ptr++;
					cset(b.tape[b.ptr - 1]);
				}
				if (H == 0xf) {
					//add to args
					b.p.push(cr);
				}
			}
			n += toSkip;
		}
		b.tape[b.ptr] = b.tape[b.ptr] === undefined ? 0 : b.tape[b.ptr];
		if (!printed) {
			console.log(b.tape[b.ptr]);
		}
	},
	args: [],
	tape: [0],
	ptr: 0,
	array(c, n, arr, skip) {
		let p = 0,
			res = [];
		n += arr.length;
		arr.forEach(e => {
			let pr = p;
			p += parseInt(e, 16) * 2;
			skip(p);
			res.push(c.slice(n + pr, n + p));
		});
		return res.map(e => parseInt(e.join``, 16));
	},
	num(c, n, arr) {
		(p = 0), (res = []);
		n += arr.length;
		arr.forEach(e => {
			let pr = p;
			p += parseInt(e, 16) * 2;
			res.push(c.slice(n + pr, n + p));
		});
		return res.map(e => parseInt(e.join``, 16));
	},
	s: s => s.split``.map(e => e.charCodeAt().toString(16)).join``,
	p: []
};
module.exports = b;
