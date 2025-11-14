import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// ========================
// 🧱 Styles
// ========================
const styles = StyleSheet.create({
  // ================= Layout & Fonts =================
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#2563EB',
    fontFamily: 'Times-Bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#578FCA',
    fontFamily: 'Times-Bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 6,
    color: '#1F3F66',
    fontFamily: 'Times-Roman',
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },

  // ================= Table =================
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 8,
    // borderStyle: 'solid',
    // borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cellHeader: {
    flex: 1,
    fontSize: 10,
    backgroundColor: '#f5f5f5',
    padding: 6,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderColor: '#ccc',
    color: '#333',
    fontFamily: 'Times-Bold',
  },
  cell: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    // borderRightWidth: 1,
    // borderColor: '#ccc',
    color: '#333',
    fontFamily: 'Times-Roman',
  },

  // ================= Images =================
  image: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  photo: {
    width: 180,
    height: 180,
    marginRight: 10,
    objectFit: 'cover',
  },
  photoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  caption: {
    fontSize: 9,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Times-Italic',
  },

  // ================= Footer =================
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    fontFamily: 'Times-Roman',
  },
});

// ========================
// 🧩 Table Helper
// ========================
const Table = ({ headers, rows }) => (
  <View style={styles.table}>
    <View style={[styles.row, { borderBottomWidth: 1, borderColor: '#ccc' }]}>
      {headers.map((h, i) => (
        <Text key={i} style={styles.cellHeader}>
          {h}
        </Text>
      ))}
    </View>
    {rows.map((r, i) => (
      <View
        key={i}
        style={[styles.row, { borderBottomWidth: 1, borderColor: '#eee' }]}
      >
        {r.map((c, j) => (
          <Text key={j} style={styles.cell}>
            {String(c ?? '-')}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const format = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}-${m}-${y}`;
};

// ========================
// 📄 Main Document
// ========================
const DPRDocument = ({ payload }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {payload.logo ? (
        // ================= WITH LOGO (3 columns) =================
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
          }}
        >
          {/* LEFT: Logo */}
          <View style={{ width: '20%', alignItems: 'flex-start' }}>
            <Image
              style={{ width: 60, height: 60, objectFit: 'contain' }}
              src={URL.createObjectURL(payload.logo)}
            />
          </View>

          {/* CENTER: Title */}
          <View style={{ width: '60%', alignItems: 'center' }}>
            <Text style={styles.title}>Progress Report</Text>
          </View>

          {/* RIGHT: Date */}
          <View style={{ width: '20%', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12 }}>
              Date:{' '}
              {(() => {
                const d = new Date();
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              })()}
            </Text>
          </View>
        </View>
      ) : (
        // ================= WITHOUT LOGO (2 columns) =================
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          {/* LEFT EMPTY SPACE (equal width) */}
          <View style={{ width: '20%' }} />

          {/* CENTER TITLE */}
          <View style={{ width: '60%', alignItems: 'center' }}>
            <Text style={styles.title}>Progress Report</Text>
          </View>

          {/* RIGHT DATE */}
          <View style={{ width: '20%', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12 }}>
              Date:{' '}
              {(() => {
                const d = new Date();
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}-${month}-${year}`;
              })()}
            </Text>
          </View>
        </View>
      )}

      {/* ================== Project Info ================== */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Project Information</Text>
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 }}
        wrap // allow wrapping to next page
      >
        {/* Column 1 */}
        <View style={{ flex: 1, paddingRight: 10 }} wrap>
          <Text style={styles.text}>
            Project Name: {payload.projectName || '-'}
          </Text>
          <Text style={styles.text}>
            Project Team:{' '}
            {payload.projectMembers?.length > 0
              ? payload.projectMembers.join(', ')
              : '-'}
          </Text>
          <Text style={styles.text}>
            Reporting Period: {format(payload.from)} {'--'}
            {format(payload.to)}
          </Text>
        </View>

        {/* Column 2 */}
        <View style={{ flex: 1, paddingLeft: 10 }} wrap>
          <Text style={styles.text}>
            Location: {payload.projectLocation || '-'}
          </Text>
          <Text style={styles.text}>
            Contract ID: {payload.projectContractId || '-'}
          </Text>
          <Text style={styles.text}>Weather: {payload.weather || '-'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ================== Tables ================== */}
      {['activity', 'manpower', 'machinery', 'material'].map((section) => {
        const data = payload[section];
        if (!data || !data.length) return null;

        const headersMap = {
          manpower: [
            'Date',
            'Type',
            'Supplier',
            'Trade',
            'Allocated',
            'Occupied',
            'Idle',
            'Remarks',
          ],
          machinery: [
            'Date',
            'Machinery',
            'Supplier',
            'Allocated',
            'Occupied',
            'Idle',
            'Maintainance',
            'Remarks',
          ],
          material: [
            'Date',
            'Material',
            'Supplier',
            'Unit',
            'Received',
            'Used',
            'Balance',
            'Remarks',
          ],
          activity: [
            'Date',
            'Activity',
            'Item',
            'Quantity',
            'Unit',
            'Status',
            'Cost',
            'Start',
            'End',
            'Assigned',
          ],
        };

        const rowsMap = {
          manpower: (m) => [
            format(m.createdAt),
            m.manPower,
            m.supplier,
            m.trade,
            m.allocated,
            m.occupied,
            m.idle,
            m.remarks,
          ],
          machinery: (m) => [
            format(m.createdAt),
            m.machinery,
            m.supplier,
            m.allocated,
            m.occupied,
            m.idle,
            m.maintainance,
            m.remarks,
          ],
          material: (m) => [
            format(m?.createdAt),
            m.material,
            m.supplier,
            m.unit,
            m.received,
            m.used,
            m.balance,
            m.remarks,
          ],
          activity: (a) => [
            format(a.createdAt),
            a.name,
            a.itemName,
            a.quantity,
            a.unit,
            a.status,
            a.cost,
            a.startedAt?.split('T')[0],
            a.endedAt?.split('T')[0],
            a.assignedTo?.firstName + ' ' + a.assignedTo?.lastName || '-',
          ],
        };

        return (
          <View key={section} wrap>
            <Text style={styles.sectionTitle}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
            <Table
              headers={headersMap[section]}
              rows={data.map(rowsMap[section])}
              wrap // allow table to break across pages
            />
          </View>
        );
      })}

      {/* ================== Lists ================== */}
      {[
        { key: 'milestones', title: 'Key Milestones' },
        { key: 'hinderances', title: 'Hindrances' },
        { key: 'qualityObservations', title: 'Quality Observations' },
        { key: 'safetyRemarks', title: 'Safety Remarks' },
      ].map((list) => {
        const items = payload[list.key];
        if (!items || !items.length) return null;

        return (
          <View key={list.key} wrap>
            <Text style={styles.sectionTitle}>{list.title}:</Text>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}
              wrap
            >
              {items.map((item, i) => (
                <Text key={i} style={{ width: '50%', marginBottom: 8 }}>
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        );
      })}

      {/* ================== Photos ================== */}
      {payload.photos?.length > 0 && (
        <View wrap>
          <Text style={styles.sectionTitle}>Annexure</Text>
          <View style={styles.photoContainer} wrap>
            {payload.photos.map((p, i) => (
              <View
                key={i}
                style={{
                  marginBottom: 10,
                  width: 180, // match photo width
                  alignItems: 'center', // center children horizontally
                }}
                wrap
              >
                {p.file && p.file instanceof File ? (
                  <Image
                    src={URL.createObjectURL(p.file)}
                    style={styles.photo}
                  />
                ) : (
                  <Text>No Image</Text>
                )}
                <Text
                  style={{
                    fontSize: 9,
                    textAlign: 'center', // center the text
                    color: '#333',
                    fontFamily: 'Times-Italic',
                    marginTop: 4,
                  }}
                >
                  {i + 1 + '). '}
                  {p.caption || '-'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Fixed Page Number Footer */}
      <Text
        fixed
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
        style={{
          position: 'absolute',
          bottom: 50,
          left: 50,
          right: 0,
          textAlign: 'center',
          fontSize: 10,
          color: '#999',
        }}
      />
    </Page>
  </Document>
);

export default DPRDocument;
