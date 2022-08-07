import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    value: `[Event "Casual Correspondence Game"]
[Site "709 Killian St"]
[Date "2022.07.05"]
[White "ChuckBruckus"]
[Black "charlesjuliank"]
[Result "0-1"]
[Annotator "charlesjuliank"]
[Mode "OTB"]
[PlyCount "66"]
[FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"]
[Variant "Standard"]
[Termination "mate"]

1. c4 Nf6 { A15 English Opening: Anglo-Indian Defense } 2. g3 e6 3. Bg2 d5 4. d3 { A rare continuation. The most popular line is Nf3: } (4. Nf3 Be7 5. O-O  O-O⩲) Bb4+! 5. Nd2 { Better was Nc3 as it doesn't block the Bishop } (5. Nc3 O-O 6. cxd5 exd5 7. a3) Nc6 6. Nf3 a6 7. Qa4! { Comes with a clever trap: } (7. Qa4 b5 8. cxb5 axb5 9. Qxa8±) O-O 8. O-O Re8 9. Re1? { Better to kick away the bishop and gain a strong pawn presence on the queenside: } (9. a3  Bc5 10. b4 Ba7±) Qd6? { This traps the bishop, forcing black to give it up for white's weak knight. } (9... Qd6 10. a3 Bxd2 11. Bxd2⩲) 10. e4 Ne7?? { White can punish this move by winning a piece: } (10... Ne7 11. e5 Bd7 12. Qd1 (12. exd6 Bxa4 13. dxe7±) Qc5 13. exf6 gxf6±) 11. Nd4 Bc5 12. exd5?? { Blunders a knight. White could still play e5 although not as strong. } (12. e5 Qd7 13. Qxd7 Nxd7⩲)  Bxd4 13. Ne4 Bd7 { Black offers a queen trade. } 14. Qa3? { White counter-offers the trade on a3. As black is up material, trades are in black's favor. This was white's last opportunity to equalize } (14. Nxd6 Bxa4 15. Nxe8 Rxe8⩱) Nxe4 15. Rxe4 Bc5? { Black stops the queen trade, however black should seek to trade down into an endgame. } 16. Qc3 { An interesting line beyond the skill of both players but that gives white some counterplay is b4: } (16. b4 Bxb4 17. Qb2 exd5 18. Bf4 Qc5 19. cxd5 Bc3 20. Rc1 Bxb2 21. Rxc5∞) exd5 17. Rg4?? { White blunders a rook with no compensation. } (17. Bf4) Bxg4 18. h3 Bxf2+! 19. Kxf2 Nf5 20. Bd2 (20. d4) (20. Bf4) Qxg3+ 21. Kf1 Ne3+? { Re2 was the forced checkmate. } (21... Re2 22. Qxg7+ Nxg7 23. Re1 Qxg2#) 22. Bxe3 Bxh3 23. Bxh3 Qxh3+ 24. Ke2 Qxe3+ 25. Kd1 Qe2+ 26. Kc1 Re3 27. Qd4 c5 28. Qxc5 Qe1+ 29. Kc2 Re2+ 30. Kb3 dxc4+ 31. Qxc4 Qa5? 32. Rf1 Qb5+? { After the queen trade, black is still winning but white has some counterplay. } (32... Qb5+ 33. Qxb5 axb5 34. Rf5 Rd8 35. Rxb5 Rxd3+ 36. Kc4∓) 33. Kc3? Qxb2# 0-1`,
  },
});

export default app;
