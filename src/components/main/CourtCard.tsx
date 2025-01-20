// 농구장 정보 카드
const CourtCard = ({ imageUrl, title, rating }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.rating}>{rating}</Text>
    </View>
  );
};
