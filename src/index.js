
const b = {
	run(c, args) {
		b.args = args;
		b.tape = [0];
		let printed=false
		c = c.toLowerCase().split``;
		for (let n = 0; n < c.length; n += 2) {
			function cset(val, ind) {
				//set cell
				//exists because I might make a mess of nested and alternate tapes.
				ind = ind || b.ptr;
				b.tape[ind] = val;
			}
			let cm = (e = 0) => c[n + e],
				H = parseInt(cm(1), 16);
			if (cm() == 'f') {
				//declare array/load arg based on 5th bit
				if (H >= 8) {
					//argument
					b.tape[b.ptr] = b.args[cm(1) - 8];
				} else {
					//array
					cset(b.array(c, n + 2, c.slice(n + 2, n + 2 + (~~cm(1) + 1) * 2)));
				}
			}
			if (cm() == 'e') {
				//number short
				if (H > 7) {
					//negative
					cset(-(H - 7));
				} else {
					//positive
					cset(H + 1);
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
				cset(res)
			}
		}
		if(!printed){
			console.log(b.tape[b.ptr])
		}
	},
	args: [],
	tape: [0],
	ptr: 0,
	array(c, n, arr) {
		let p = 0,
			res = [];
		n += arr.length;
		arr.forEach(e => {
			let pr = p;
			p += parseInt(e, 16) * 2;
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
	//golfed code
	s:s=>s.split``.map(e=>e.charCodeAt().toString(16)).join``
};
module.exports = b;
