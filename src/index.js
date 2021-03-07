let board = null;
let chess = new Chess();
let $status = $('#status');
let $fen = $('#fen');
let $pgn = $('#pgn');
let $com = $('#com');
let $exp = $('.title3');
let $explorer = $('#explorer');

function onDragStart(source, piece, position, orientation) {
    if(chess.game_over()) {
        return false;
    };

    if((chess.turn() == 'w' && piece.search(/^b/) !== -1) || (chess.turn() == 'b' && piece.search(/^w/) !== -1)) {
        return false;
    };
};

function onDrop(source, target) {
    let move = chess.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if(move == null) {
        return 'snapback';
    };

    updateStatus();
};

function onSnapEnd () {
    board.position(chess.fen());
};

function onChange(oldPos, newPos) {
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('New position: ' + Chessboard.objToFen(newPos))

    let url = `https://explorer.lichess.ovh/lichess?variant=standard&moves=6&speeds[]=rapid&speeds[]=classical&ratings[]=1600&ratings[]=1800&fen=${chess.fen()}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            let openingData = Object.values(data)[5];
            let playerData = Object.values(data)[3];
            //console.dir(playerData);

            $explorer.html(`
                <div class="move">${playerData[0].san}</div>
                <div class="number">${playerData[0].white + playerData[0].draws + playerData[0].black}</div>
                <div class="wins">
                    <div class="white">${playerData[0].white}</div>
                    <div class="draw">${playerData[0].draws}</div>
                    <div class="black">${playerData[0].black}</div>
                </div>

                <div class="move">${playerData[1].san}</div>
                <div class="number">${playerData[1].white + playerData[1].draws + playerData[1].black}</div>
                <div class="wins">
                    <div class="white">${playerData[1].white}</div>
                    <div class="draw">${playerData[1].draws}</div>
                    <div class="black">${playerData[1].black}</div>
                </div>

                <div class="move">${playerData[2].san}</div>
                <div class="number">${playerData[2].white + playerData[2].draws + playerData[2].black}</div>
                <div class="wins">
                    <div class="white">${playerData[2].white}</div>
                    <div class="draw">${playerData[2].draws}</div>
                    <div class="black">${playerData[2].black}</div>
                </div>

                <div class="move">${playerData[3].san}</div>
                <div class="number">${playerData[3].white + playerData[3].draws + playerData[3].black}</div>
                <div class="wins">
                    <div class="white">${playerData[3].white}</div>
                    <div class="draw">${playerData[3].draws}</div>
                    <div class="black">${playerData[3].black}</div>
                </div>

                <div class="move">${playerData[4].san}</div>
                <div class="number">${playerData[4].white + playerData[4].draws + playerData[4].black}</div>
                <div class="wins">
                    <div class="white">${playerData[4].white}</div>
                    <div class="draw">${playerData[4].draws}</div>
                    <div class="black">${playerData[4].black}</div>
                </div>
            `);

            if(openingData !== null) {
                $com.html(openingData.name);
                $exp.html(`<b>${openingData.eco}</b> ${openingData.name}`) 
            } else if(openingData == null) {
                return false
            }      
        });

    //console.log(chess.history());
};

$('#prevBtn').on('click', () => {
    chess.undo();
    board.position(chess.fen());
    //console.log(chess.history());
});

$('#nextBtn').on('click', () => {
    chess.move(chess.history());
    board.position(chess.fen());
    //console.log(chess.history())
});

$('#resetBtn').on('click', () => {
    window.location.reload();
});

$('#flipBtn').on('click', () => {
    board.flip();
});

$('#analyzeBtn').on('click', () => {
    const stats3 = document.getElementById('stats3');
    const inner3 = document.getElementById('inner3');

    if(stats3.style.display == 'none') {
        stats3.style.display = 'block';
        inner3.style.display = 'block';
    } else {
        stats3.style.display = 'none';
        inner3.style.display = 'none';
    }
});

function updateStatus() {
    let status = '';

    let moveColor = 'White';
    if(chess.turn() == 'b') {
        moveColor = 'Black'
    }

    if(chess.in_checkmate()) {
        status = 'Checkmate! ' + moveColor + ' lost!';
        return chess.reset();
    } else if((chess.in_draw()) || (chess.in_stalemate()) || (chess.in_threefold_repetition()) || (chess.insufficient_material())) {
        status = 'Draw!'
    } else {
        status = moveColor + ' to move!'

        if(chess.in_check()) {
            status = moveColor + ' is in check!'
        }
    }

    $status.html(status)
    $fen.html(chess.fen())
    $pgn.html(chess.pgn({ max_width: 10, newline_char: '<br>' }))
};

if(chess.fen() == 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
    $com.html('Play first move!');
    $exp.html('No opening played!')
};

let config = {
    position: 'start',
    showNotation: true,
    draggable: true,
    dropOffBoard: 'snapback',
    onDragStart: onDragStart,
    onChange: onChange,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

board = Chessboard('board', config);

updateStatus();
